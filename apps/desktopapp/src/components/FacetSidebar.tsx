import { APP_NAME } from "@facet/config";
import type { MockSearchScenarioSummary } from "@facet/search-providers";

import { formatTime } from "../lib/facetExports";
import type { FacetWorkbenchState } from "../hooks/useFacetWorkbench";

type FacetSidebarProps = {
  scenarios: MockSearchScenarioSummary[];
  state: FacetWorkbenchState;
};

export function FacetSidebar({ scenarios, state }: FacetSidebarProps) {
  return (
    <aside className="facet-sidebar">
      <header className="brand-block">
        <span>Desktop workbench</span>
        <h1>{APP_NAME}</h1>
        <p>Inspect questions from several angles without forcing one final answer.</p>
      </header>

      <FacetQueryPanel state={state} />
      <FacetHandoffPanel state={state} />
      <FacetEndpointPanel state={state} />
      <FacetScenarioPanel scenarios={scenarios} state={state} />
      <FacetCorpusPanel state={state} />
      <FacetHistoryPanel state={state} />
    </aside>
  );
}

function FacetQueryPanel({ state }: { state: FacetWorkbenchState }) {
  const { importInputRef, isRunning, notice } = state;
  const { locale, queryText, runSearch, setLocale, setQueryText } = state.query;
  const { exportWorkspace, importWorkspace } = state.workspace;

  return (
    <section className="query-panel" aria-label="Facet query">
      <label>
        Question
        <textarea value={queryText} onChange={(event) => setQueryText(event.target.value)} />
      </label>

      <label>
        Locale
        <input value={locale} onChange={(event) => setLocale(event.target.value)} />
      </label>

      <button disabled={isRunning} type="button" onClick={runSearch}>
        {isRunning ? "Running..." : "Run Facet"}
      </button>
      <div className="workspace-actions">
        <button type="button" onClick={exportWorkspace}>
          Export Workspace
        </button>
        <button type="button" onClick={() => importInputRef.current?.click()}>
          Import Workspace
        </button>
      </div>
      <input
        ref={importInputRef}
        className="hidden-file-input"
        type="file"
        accept="application/json"
        onChange={importWorkspace}
      />

      <p className="notice" role="status">
        {notice}
      </p>
    </section>
  );
}

function FacetHandoffPanel({ state }: { state: FacetWorkbenchState }) {
  const { handoffJson, importedHandoff, importOrientationPacket, setHandoffJson } = state.handoff;

  return (
    <section className="query-panel" aria-label="Facet handoff inbox">
      <span className="eyebrow">Handoff Inbox</span>
      <label>
        Orientation packet JSON
        <textarea value={handoffJson} onChange={(event) => setHandoffJson(event.target.value)} />
      </label>
      <button type="button" onClick={importOrientationPacket}>
        Import Orientation
      </button>
      {importedHandoff ? (
        <p className="notice">
          {importedHandoff.sourceApp} / {importedHandoff.handoff.recommendedNextApp} /{" "}
          {importedHandoff.response.search.results.length} result(s)
        </p>
      ) : null}
    </section>
  );
}

function FacetEndpointPanel({ state }: { state: FacetWorkbenchState }) {
  const endpoint = state.endpoint;

  return (
    <section className="query-panel" aria-label="Suite endpoint configuration">
      <span className="eyebrow">Suite Sends</span>
      {(["derive", "sentinel", "assembly"] as const).map((target) => (
        <label key={target}>
          {target}
          <input value={endpoint.endpointConfig[target]} onChange={(event) => endpoint.updateEndpoint(target, event.target.value)} />
          {endpoint.sendValidationErrors[target] ? <small className="send-error">{endpoint.sendValidationErrors[target]}</small> : null}
          {endpoint.endpointHealth[target] ? <small>{endpoint.endpointHealth[target]}</small> : null}
        </label>
      ))}
      <button type="button" onClick={() => void endpoint.checkSendEndpoints()}>
        Check Endpoints
      </button>
      {endpoint.lastSendStatus ? <p className="notice">{endpoint.lastSendStatus}</p> : null}
      {endpoint.sendRetryQueue.length ? <FacetRetryQueue state={state} /> : null}
    </section>
  );
}

function FacetRetryQueue({ state }: { state: FacetWorkbenchState }) {
  const endpoint = state.endpoint;

  return (
    <div className="retry-list">
      <span className="eyebrow">Retry queue</span>
      <button type="button" onClick={() => void endpoint.retryAllSends()}>
        Retry all
      </button>
      {endpoint.sendRetryQueue.slice(0, 5).map((item) => (
        <div key={item.id}>
          <small>
            {item.target} · {new Date(item.failedAt).toLocaleString()} · {item.message.slice(0, 100)}
          </small>
          <button type="button" onClick={() => void endpoint.sendPacketToEndpoint(item.target, item.packet, item.endpoint, item.id)}>
            Retry {item.target}
          </button>
          <button type="button" onClick={() => endpoint.setSelectedRetryPayload(item)}>
            Inspect
          </button>
          <button type="button" onClick={() => endpoint.dismissRetry(item.id)}>
            Dismiss
          </button>
        </div>
      ))}
      {endpoint.selectedRetryPayload ? <pre>{JSON.stringify(endpoint.selectedRetryPayload.packet, null, 2)}</pre> : null}
    </div>
  );
}

function FacetScenarioPanel({ scenarios, state }: FacetSidebarProps) {
  return (
    <section className="scenario-panel" aria-label="Example scenarios">
      <span className="eyebrow">Scenarios</span>
      <div className="scenario-list">
        {scenarios.map((scenario) => (
          <button key={scenario.id} type="button" onClick={() => state.query.applyScenario(scenario.exampleQuery)}>
            <strong>{scenario.label}</strong>
            <small>{scenario.exampleQuery}</small>
          </button>
        ))}
      </div>
    </section>
  );
}

function FacetCorpusPanel({ state }: { state: FacetWorkbenchState }) {
  const { documentDraft, localCorpus, removeCorpusDocument, saveCorpusDocument, updateDocumentDraft } = state.corpus;

  return (
    <section className="corpus-panel" aria-label="Local corpus">
      <span className="eyebrow">Local Corpus</span>
      <label>
        Document title
        <input value={documentDraft.title} onChange={(event) => updateDocumentDraft("title", event.target.value)} />
      </label>
      <label>
        Source
        <input
          placeholder="File, customer note, meeting, or URL label"
          value={documentDraft.source}
          onChange={(event) => updateDocumentDraft("source", event.target.value)}
        />
      </label>
      <label>
        Source URL
        <input placeholder="Optional" value={documentDraft.sourceUrl} onChange={(event) => updateDocumentDraft("sourceUrl", event.target.value)} />
      </label>
      <label>
        Text
        <textarea value={documentDraft.body} onChange={(event) => updateDocumentDraft("body", event.target.value)} />
      </label>
      <label>
        Tags
        <input placeholder="Optional comma-separated tags" value={documentDraft.tags} onChange={(event) => updateDocumentDraft("tags", event.target.value)} />
      </label>
      <button type="button" onClick={saveCorpusDocument}>
        Save Document
      </button>
      <div className="corpus-list" aria-label="Saved local documents">
        {localCorpus.length > 0 ? (
          localCorpus.slice(0, 8).map((document) => (
            <article key={document.id}>
              <div>
                <strong>{document.title}</strong>
                <small>{document.source || "Local document"}</small>
              </div>
              <button type="button" onClick={() => removeCorpusDocument(document.id)}>
                Remove
              </button>
            </article>
          ))
        ) : (
          <p>No local documents saved yet.</p>
        )}
      </div>
    </section>
  );
}

function FacetHistoryPanel({ state }: { state: FacetWorkbenchState }) {
  const { activeId, savedRuns, setActiveId } = state.history;

  return (
    <nav className="history-list" aria-label="Facet history">
      {savedRuns.map((run) => (
        <button
          className={run.id === activeId ? "history-item history-item-active" : "history-item"}
          key={run.id}
          onClick={() => setActiveId(run.id)}
          type="button"
        >
          <span>{run.queryText}</span>
          <small>
            {run.result.search.results.length} results / {formatTime(run.result.search.query.submittedAt)}
          </small>
        </button>
      ))}
    </nav>
  );
}
