import { projects } from './data';

export default function PortfolioFallback() {
  return (
    <div className="sr-only" aria-label="Portfolio projects">
      <h1>3D Architectural Visualization Portfolio — Retrotekt</h1>
      <p>
        Photorealistic renders, walkthrough animations, and construction documentation for
        hospitality and commercial projects across California. Three Chocolate Fish Coffee
        Roasters locations — Modesto, Livermore, and Sacramento — pre-visualized end-to-end.
      </p>
      <ul>
        {projects.map((p) => (
          <li key={p.slug}>
            <h2>{p.name}</h2>
            <p>{p.city} &middot; {p.year} &middot; {p.type}</p>
            <p>{p.description}</p>
            <p>Scope: {p.scope.join(', ')}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
