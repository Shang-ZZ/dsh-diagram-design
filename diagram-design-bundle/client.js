window.__ModuleLoader__.load({
  id: '@local/diagram-design',
  factory(require) {
    const React = require('react');
    const { useState, useEffect, useMemo } = React;
    const h = React.createElement;

    // Sidebar icon, rendered by the global panel row (receives { size, active }).
    function PanelIcon({ size }) {
      return h(
        'svg',
        { viewBox: '0 0 64 64', width: size, height: size, 'aria-hidden': true, style: { display: 'block' } },
        h('rect', { x: 4, y: 4, width: 56, height: 56, rx: 12, fill: 'none', stroke: 'currentColor', strokeWidth: 3, opacity: 0.45 }),
        h('rect', { x: 16, y: 14, width: 32, height: 14, rx: 4, fill: 'currentColor' }),
        h('rect', { x: 16, y: 36, width: 32, height: 14, rx: 4, fill: 'none', stroke: 'currentColor', strokeWidth: 3 }),
        h('line', { x1: 32, y1: 28, x2: 32, y2: 36, stroke: 'currentColor', strokeWidth: 3 })
      );
    }

    function GalleryPanel() {
      const [manifest, setManifest] = useState(null);
      const [query, setQuery] = useState('');
      const [selected, setSelected] = useState(null);
      const [html, setHtml] = useState('');
      const [loading, setLoading] = useState(false);
      const [error, setError] = useState('');

      useEffect(() => {
        let alive = true;
        fetch('/diagram-design/gallery')
          .then((r) => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
          .then((m) => { if (alive) { setManifest(m); setSelected(m[0] ?? null); } })
          .catch((e) => { if (alive) setError(String(e)); });
        return () => { alive = false; };
      }, []);

      useEffect(() => {
        if (!selected) return;
        let alive = true;
        setLoading(true);
        setHtml('');
        setError('');
        fetch('/diagram-design/example/' + selected.slug)
          .then((r) => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.text(); })
          .then((t) => { if (alive) setHtml(t); })
          .catch((e) => { if (alive) setError(String(e)); })
          .finally(() => { if (alive) setLoading(false); });
        return () => { alive = false; };
      }, [selected]);

      const filtered = useMemo(() => {
        if (!manifest) return [];
        const q = query.trim().toLowerCase();
        if (!q) return manifest;
        return manifest.filter((t) => (t.name + ' ' + t.description).toLowerCase().includes(q));
      }, [manifest, query]);

      const v = (name, fallback) => `var(--dsw-alias-${name}, ${fallback})`;

      const rootStyle = {
        display: 'flex', height: '100%', width: '100%', minHeight: 0,
        backgroundColor: v('canvas', '#fff'), color: v('text', '#17181c'),
        fontFamily: 'inherit',
      };
      const listStyle = {
        width: 264, flexShrink: 0, borderRight: `1px solid ${v('border', '#e6e7ea')}`,
        overflowY: 'auto', display: 'flex', flexDirection: 'column',
      };
      const searchStyle = { padding: 12, borderBottom: `1px solid ${v('border', '#e6e7ea')}` };
      const inputStyle = {
        width: '100%', boxSizing: 'border-box', padding: '6px 8px', fontSize: 13, borderRadius: 6,
        border: `1px solid ${v('border', '#d5d7db')}`, backgroundColor: v('bg', '#fff'),
        color: v('text', '#17181c'), outline: 'none',
      };
      const itemStyle = (active) => ({
        padding: '9px 12px', cursor: 'pointer', flexShrink: 0,
        borderLeft: `3px solid ${active ? v('accent', '#bf4520') : 'transparent'}`,
        backgroundColor: active ? v('hover', 'rgba(0,0,0,0.05)') : 'transparent',
      });
      const itemNameStyle = { fontSize: 13, fontWeight: 600 };
      const itemDescStyle = { fontSize: 11, opacity: 0.62, marginTop: 2, lineHeight: 1.35 };
      const previewStyle = { flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' };
      const headerStyle = {
        padding: '10px 14px', borderBottom: `1px solid ${v('border', '#e6e7ea')}`,
        fontWeight: 600, fontSize: 14, flexShrink: 0,
      };
      const headerDescStyle = { fontWeight: 400, fontSize: 12, opacity: 0.6, marginTop: 2 };
      const iframeWrapStyle = { flex: 1, padding: 12, overflow: 'auto' };
      const iframeStyle = {
        width: '100%', height: '100%', minHeight: 380, boxSizing: 'border-box',
        border: `1px solid ${v('border', '#ececee')}`, borderRadius: 8, backgroundColor: '#f5f5f5',
      };
      const pad = { padding: 20, fontSize: 13, opacity: 0.7 };

      if (error) {
        return h('div', { style: rootStyle }, h('div', { style: pad }, 'Failed to load the gallery: ' + error));
      }
      if (!manifest) {
        return h('div', { style: rootStyle }, h('div', { style: pad }, 'Loading gallery\u2026'));
      }

      return h(
        'div',
        { style: rootStyle },
        h(
          'div',
          { style: listStyle },
          h(
            'div',
            { style: searchStyle },
            h('input', {
              style: inputStyle,
              placeholder: 'Search 45 diagram types\u2026',
              value: query,
              onChange: (e) => setQuery(e.target.value),
            })
          ),
          filtered.map((t) =>
            h(
              'div',
              { key: t.slug, style: itemStyle(selected && selected.slug === t.slug), onClick: () => setSelected(t) },
              h('div', { style: itemNameStyle }, t.name),
              h('div', { style: itemDescStyle }, t.description)
            )
          )
        ),
        h(
          'div',
          { style: previewStyle },
          h(
            'div',
            { style: headerStyle },
            selected ? selected.name : '',
            selected ? h('div', { style: headerDescStyle }, selected.description) : null
          ),
          h(
            'div',
            { style: iframeWrapStyle },
            loading
              ? h('div', { style: pad }, 'Loading preview\u2026')
              : html
                ? h('iframe', { style: iframeStyle, srcDoc: html, sandbox: '', title: selected ? selected.name + ' preview' : 'diagram preview' })
                : h('div', { style: pad }, 'Select a type to preview its example diagram.')
          )
        )
      );
    }

    return {
      inject: ['slots'],
      apply(ctx) {
        ctx.slots.inject('main', () => ctx.slots.register({ name: 'main', key: 'diagram-gallery' }, GalleryPanel));
        ctx.slots.inject('sidebar.panellist', () =>
          ctx.slots.register(
            { name: 'sidebar.panellist', id: 'diagram-gallery', order: 30, label: () => 'Diagram Gallery' },
            PanelIcon
          )
        );
      },
    };
  },
});
