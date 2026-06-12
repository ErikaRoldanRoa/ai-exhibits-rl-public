#!/usr/bin/env python3
"""Verify the theoretical-minimum moves claimed by the Hub + Exhibits via BFS on the
sliding-puzzle state graph.

For each of 2×2, 2×3, 3×3:
- Enumerate the reachable component containing the goal via BFS.
- Report:
    - |reachable states| (should be n!/2)
    - ecc(goal) = God's Number (worst-case optimal solution INTO the goal)
    - The TRUE graph diameter, which is a stronger, global quantity.
      God's number is goal-rooted; the diameter is any-to-any. They coincide
      on the Rubik's cube by vertex-transitivity, but sliding graphs are NOT
      vertex-transitive (the blank's cell fixes a vertex's degree). However,
      tile relabelling is a graph automorphism fixing the blank's cell, so
      eccentricity depends only on where the blank sits: one BFS per blank
      cell settles the diameter. (Pleasing wrinkle: on the 3×3, centre-blank
      states have eccentricity 30, not 31.)
    - The benchmark states B1…Bk (from index.html BENCHMARKS) and their distance to goal.

Run:
    python3 tools/verify_gods_numbers.py

Expected output (abridged):
    2×2: |V| = 12, diameter = 6     ✓
    2×3: |V| = 360, diameter = 21   ✓
    3×3: |V| = 181440, diameter = 31 ✓
"""
from __future__ import annotations

from collections import deque


def moves(state, rows, cols):
    """Yield (new_state, action) for every legal slide from `state` (tuple)."""
    blank = state.index(0)
    r, c = divmod(blank, cols)
    for dr, dc in ((-1, 0), (1, 0), (0, -1), (0, 1)):
        nr, nc = r + dr, c + dc
        if 0 <= nr < rows and 0 <= nc < cols:
            nb = nr * cols + nc
            lst = list(state)
            lst[blank], lst[nb] = lst[nb], lst[blank]
            yield tuple(lst)


def bfs_component(rows, cols):
    """Return dict state→distance, starting BFS from goal."""
    goal = tuple(list(range(1, rows * cols)) + [0])
    dist = {goal: 0}
    q = deque([goal])
    while q:
        s = q.popleft()
        for t in moves(s, rows, cols):
            if t not in dist:
                dist[t] = dist[s] + 1
                q.append(t)
    return dist


# Benchmark states + expected distances, copied from index.html's BENCHMARKS object
# (curated fixed starting positions, identical across all students).
BENCHMARKS = {
    (2, 2): {
        1: ((1, 0, 3, 2), 1),
        2: ((0, 1, 3, 2), 2),
        3: ((3, 1, 0, 2), 3),
        4: ((3, 1, 2, 0), 4),
        5: ((3, 0, 2, 1), 5),
        6: ((0, 3, 2, 1), 6),   # God's Number
    },
    (2, 3): {
        1: ((1, 2, 3, 4, 0, 5), 1),
        2: ((0, 1, 2, 4, 5, 3), 3),
        3: ((4, 0, 2, 5, 1, 3), 6),
        4: ((4, 2, 3, 5, 0, 1), 9),
        5: ((4, 5, 0, 1, 2, 3), 21),   # God's Number
    },
    (3, 3): {
        1: ((1, 2, 3, 4, 5, 6, 7, 0, 8), 1),
        2: ((5, 4, 2, 7, 1, 3, 0, 8, 6), 10),
        3: ((0, 7, 2, 4, 5, 3, 8, 1, 6), 18),
        4: ((0, 7, 6, 4, 2, 5, 8, 3, 1), 26),
        5: ((6, 4, 7, 8, 5, 0, 3, 2, 1), 31),   # God's Number
    },
}


def bfs_ecc_from(start, rows, cols):
    """Eccentricity of `start` within its component (max BFS depth)."""
    dist = {start: 0}
    q = deque([start])
    mx = 0
    while q:
        s = q.popleft()
        for t in moves(s, rows, cols):
            if t not in dist:
                dist[t] = dist[s] + 1
                if dist[t] > mx:
                    mx = dist[t]
                q.append(t)
    return mx


def true_diameter(rows, cols, dist):
    """Diameter of the goal's component.

    Tile relabelling is a graph automorphism that fixes the blank's cell, so
    eccentricity is constant on (component, blank-cell) classes: one BFS from
    a representative per blank cell suffices.
    """
    reps = {}
    for s in dist:
        b = s.index(0)
        if b not in reps:
            reps[b] = s
        if len(reps) == rows * cols:
            break
    eccs = {b: bfs_ecc_from(s, rows, cols) for b, s in sorted(reps.items())}
    return max(eccs.values()), eccs


def main():
    ok = True
    for rows, cols, expected_states, expected_g in [
        (2, 2, 12, 6),
        (2, 3, 360, 21),
        (3, 3, 181440, 31),
    ]:
        print(f"--- {rows}×{cols} ---")
        dist = bfs_component(rows, cols)
        states = len(dist)
        g = max(dist.values())  # ecc(goal) = God's number
        diam, eccs = true_diameter(rows, cols, dist)
        s_mark = "✓" if states == expected_states else "✗"
        g_mark = "✓" if g == expected_g else "✗"
        diam_mark = "✓" if diam == g else "✗"
        print(f"  |reachable|       = {states} (expected {expected_states}) {s_mark}")
        print(f"  ecc(goal) = G     = {g}  (expected {expected_g}) {g_mark}")
        print(f"  diameter (global) = {diam}  (= G? {diam_mark})  ecc per blank cell: {eccs}")
        if states != expected_states or g != expected_g or diam != g:
            ok = False

        # Check benchmark states against their documented distances
        for bnum, (state, expected) in BENCHMARKS.get((rows, cols), {}).items():
            d = dist.get(state)
            mark = "✓" if d == expected else "✗"
            suffix = "" if d is not None else " (UNREACHABLE!)"
            print(f"  B{bnum}: dist={d} (expected {expected}) {mark}{suffix}")
            if d != expected:
                ok = False

    print()
    print("RESULT:", "PASS ✓" if ok else "FAIL ✗")
    return 0 if ok else 1


if __name__ == "__main__":
    raise SystemExit(main())
