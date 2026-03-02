/**
 * Re-export react-resizable-panels' built-in layout persistence hook.
 * Usage:
 *   const { defaultLayout, onLayoutChanged } = usePanelLayout('my-panel-id');
 *   <ResizablePanelGroup defaultLayout={defaultLayout} onLayoutChanged={onLayoutChanged}>
 */
export { useDefaultLayout as usePanelLayout } from 'react-resizable-panels';
