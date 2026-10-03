'use client';

import { Fragment, useDeferredValue, useMemo, useState } from 'react';
import type { Exercise } from '@/lib/exercises';
import styles from './library.module.css';

/** Display grouping for the movement-pattern board; every pattern appears once. */
const PATTERN_FAMILIES: { name: string; patterns: string[] }[] = [
  { name: 'Push & pull', patterns: ['Horizontal Push', 'Vertical Push', 'Horizontal Pull', 'Vertical Pull'] },
  { name: 'Lower body', patterns: ['Squat', 'Hinge', 'Lunge', 'Carry'] },
  { name: 'Core', patterns: ['Core Flexion', 'Core Stability', 'Rotation'] },
  { name: 'Accessory & conditioning', patterns: ['Isolation', 'Power', 'Cardio', 'Mobility'] },
];

type Filters = { pattern: string; bodyPart: string; category: string; equipment: string };
const NO_FILTERS: Filters = { pattern: '', bodyPart: '', category: '', equipment: '' };

function countBy(list: Exercise[], key: (e: Exercise) => string | null) {
  const counts = new Map<string, number>();
  for (const e of list) {
    const k = key(e);
    if (k) counts.set(k, (counts.get(k) ?? 0) + 1);
  }
  return counts;
}

export default function ExerciseLibrary({
  exercises,
  patternDescriptions,
}: {
  exercises: Exercise[];
  patternDescriptions: Record<string, string>;
}) {
  const [filters, setFilters] = useState<Filters>(NO_FILTERS);
  const [query, setQuery] = useState('');
  const [openId, setOpenId] = useState<string | null>(null);
  const deferredQuery = useDeferredValue(query);

  const counts = useMemo(
    () => ({
      pattern: countBy(exercises, (e) => e.pattern),
      bodyPart: countBy(exercises, (e) => e.bodyPart),
      category: countBy(exercises, (e) => e.category),
      equipment: countBy(exercises, (e) => e.equipment),
    }),
    [exercises]
  );

  const visible = useMemo(() => {
    const q = deferredQuery.trim().toLowerCase();
    return exercises.filter(
      (e) =>
        (!filters.pattern || e.pattern === filters.pattern) &&
        (!filters.bodyPart || e.bodyPart === filters.bodyPart) &&
        (!filters.category || e.category === filters.category) &&
        (!filters.equipment || e.equipment === filters.equipment) &&
        (!q || e.name.toLowerCase().includes(q) || e.target.toLowerCase().includes(q))
    );
  }, [exercises, filters, deferredQuery]);

  const setFilter = (key: keyof Filters, value: string) => setFilters((f) => ({ ...f, [key]: value }));

  const select = (key: Exclude<keyof Filters, 'pattern'>, id: string, label: string) => (
    <select
      id={id}
      aria-label={label}
      className={styles.select}
      value={filters[key]}
      onChange={(ev) => setFilter(key, ev.target.value)}
    >
      <option value="">All {label.toLowerCase()}</option>
      {[...counts[key].entries()]
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([value, n]) => (
          <option key={value} value={value}>
            {value} ({n})
          </option>
        ))}
    </select>
  );

  return (
    <div className={styles.library}>
      <header>
        <div className="section-label">Members only</div>
        <h1 className="section-h2">Exercise Library</h1>
        <p className="section-sub">
          Every exercise in the APEX catalog, sorted by body part, workout category and movement
          pattern. Pick a movement pattern or use the filters, then open any exercise to read its
          instructions.
        </p>
        <div className={styles.totals}>
          <span><b>{exercises.length.toLocaleString()}</b>exercises</span>
          <span><b>{counts.bodyPart.size}</b>body parts</span>
          <span><b>{counts.category.size}</b>categories</span>
          <span><b>{counts.pattern.size}</b>movement patterns</span>
        </div>
      </header>

      <section aria-labelledby="patterns-heading">
        <h2 id="patterns-heading" className={styles.heading}>Movement patterns</h2>
        <div className={styles.families}>
          {PATTERN_FAMILIES.map((family) => (
            <div key={family.name} className={styles.family}>
              <div className={styles.familyName}>{family.name}</div>
              {family.patterns.map((p) => (
                <button
                  key={p}
                  type="button"
                  className={styles.pattern}
                  aria-pressed={filters.pattern === p}
                  onClick={() => setFilter('pattern', filters.pattern === p ? '' : p)}
                >
                  <span>{p}</span>
                  <span className={styles.patternCount}>{counts.pattern.get(p) ?? 0}</span>
                </button>
              ))}
            </div>
          ))}
        </div>
        <p className={styles.patternDesc}>
          {filters.pattern
            ? `${filters.pattern}: ${patternDescriptions[filters.pattern] ?? ''}`
            : 'Select a pattern to filter the list. Select it again to show all patterns.'}
        </p>
      </section>

      <section aria-label="Exercises">
        <div className={styles.bar}>
          <input
            id="library-search"
            type="search"
            className={styles.search}
            placeholder="Search exercises, e.g. deadlift"
            aria-label="Search exercises"
            value={query}
            onChange={(ev) => setQuery(ev.target.value)}
          />
          {select('bodyPart', 'library-body-part', 'Body parts')}
          {select('category', 'library-category', 'Categories')}
          {select('equipment', 'library-equipment', 'Equipment')}
          <button
            type="button"
            className={styles.clear}
            onClick={() => {
              setFilters(NO_FILTERS);
              setQuery('');
            }}
          >
            Clear filters
          </button>
        </div>

        <div className={styles.status}>
          <span>
            <strong>{visible.length.toLocaleString()}</strong> of {exercises.length.toLocaleString()} exercises
          </span>
          <span>Select a row to see instructions</span>
        </div>

        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Exercise</th>
                <th>Body part</th>
                <th>Target</th>
                <th>Category</th>
                <th>Movement pattern</th>
                <th>Equipment</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((e) => {
                const isOpen = openId === e.id;
                const toggle = () => setOpenId(isOpen ? null : e.id);
                return (
                  <Fragment key={e.id}>
                    <tr
                      className={styles.row}
                      tabIndex={0}
                      aria-expanded={isOpen}
                      onClick={toggle}
                      onKeyDown={(ev) => {
                        if (ev.key === 'Enter' || ev.key === ' ') {
                          ev.preventDefault();
                          toggle();
                        }
                      }}
                    >
                      <td className={styles.name}>{e.name}</td>
                      <td className={styles.cap}>{e.bodyPart}</td>
                      <td className={styles.cap}>{e.target}</td>
                      <td>{e.category ?? <span className={styles.none}>None</span>}</td>
                      <td><span className={styles.tag}>{e.pattern}</span></td>
                      <td className={styles.cap}>{e.equipment}</td>
                    </tr>
                    {isOpen && (
                      <tr className={styles.detail}>
                        <td colSpan={6}>
                          <p>{e.instructions ?? <span className={styles.none}>No instructions yet.</span>}</p>
                          {e.secondary.length > 0 && (
                            <p>
                              <span className={styles.detailKey}>Also works</span>
                              {e.secondary.join(', ')}
                            </p>
                          )}
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
          {visible.length === 0 && (
            <div className={styles.empty}>
              No exercises match these filters. Clear a filter or try a shorter search.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
