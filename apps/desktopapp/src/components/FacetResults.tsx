import type { FacetWorkbenchState } from "../hooks/useFacetWorkbench";

export function FacetResults({ state }: { state: FacetWorkbenchState }) {
  const activeRun = state.activeRun;

  return (
    <section className="facet-results" aria-label="Facet review">
      {activeRun ? (
        <>
          <header className="review-header">
            <div>
              <span className="eyebrow">Orientation</span>
              <h2>{activeRun.result.reframing.block.heading}</h2>
              <p>{activeRun.result.reframing.block.line}</p>
            </div>
            <div className="count-card">
              <strong>{activeRun.result.search.results.length}</strong>
              <span>{state.corpus.localCorpus.length} local docs</span>
            </div>
          </header>

          <div className="review-grid">
            <FollowUpsPanel state={state} />
            <RelatedConceptsPanel state={state} />
            <ResultsPanel state={state} />
            <ExportPanel state={state} />
          </div>
        </>
      ) : (
        <section className="empty-state">
          <span className="eyebrow">No review selected</span>
          <h2>Run Facet to create a local multi-angle review.</h2>
        </section>
      )}
    </section>
  );
}

function FollowUpsPanel({ state }: { state: FacetWorkbenchState }) {
  const block = state.activeRun?.result.reframing.block;
  if (!block) return null;

  return (
    <section className="panel-card">
      <header className="panel-header">
        <span>Follow-Ups</span>
        <strong>{block.followups.length}</strong>
      </header>
      <ul>
        {block.followups.map((followup) => (
          <li key={followup.id}>{followup.prompt}</li>
        ))}
      </ul>
    </section>
  );
}

function RelatedConceptsPanel({ state }: { state: FacetWorkbenchState }) {
  const concepts = state.activeRun?.result.reframing.block.relatedConcepts ?? [];

  return (
    <section className="panel-card">
      <header className="panel-header">
        <span>Related Concepts</span>
        <strong>{concepts.length}</strong>
      </header>
      <ul>
        {concepts.map((concept) => (
          <li key={concept.id}>
            <strong>{concept.label}</strong>
            <span>{concept.queryHint}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function ResultsPanel({ state }: { state: FacetWorkbenchState }) {
  const activeRun = state.activeRun;
  if (!activeRun) return null;

  return (
    <section className="panel-card result-card">
      <header className="panel-header">
        <span>Results</span>
        <strong>{activeRun.result.search.safetyDisposition}</strong>
      </header>
      <div className="result-list">
        {activeRun.result.search.results.length > 0 ? (
          activeRun.result.search.results.map((item) => (
            <article key={item.id}>
              <strong>{item.title}</strong>
              <span>{item.hostname}</span>
              <p>{item.snippet}</p>
              <small>
                {item.provenance.commonality.status} across {item.provenance.commonality.providerCount} provider(s)
              </small>
            </article>
          ))
        ) : (
          <p>No local or built-in results matched this query yet.</p>
        )}
      </div>
    </section>
  );
}

function ExportPanel({ state }: { state: FacetWorkbenchState }) {
  const activeRun = state.activeRun;
  if (!activeRun) return null;
  const actions = state.results;

  return (
    <section className="panel-card export-card">
      <header className="panel-header">
        <span>Export</span>
        <strong>{activeRun.locale}</strong>
      </header>
      <div className="action-row">
        <button type="button" onClick={actions.copyMarkdown}>
          Copy Markdown
        </button>
        <button type="button" onClick={actions.copyDerivePrompt}>
          Copy Derive Prompt
        </button>
        <button type="button" onClick={actions.exportMarkdown}>
          Export
        </button>
        <button type="button" onClick={() => actions.exportOrientationPacket("derive")}>
          Export Orientation
        </button>
        <button type="button" onClick={() => void actions.sendOrientationPacket("derive")}>
          Send Derive
        </button>
        <button type="button" onClick={() => void actions.sendOrientationPacket("sentinel")}>
          Send Sentinel
        </button>
        <button type="button" onClick={() => void actions.sendOrientationPacket("assembly")}>
          Send Assembly
        </button>
      </div>
      <pre>{state.orientationPacket ? JSON.stringify(state.orientationPacket, null, 2) : ""}</pre>
    </section>
  );
}

