import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent, waitFor, act, cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';
import { FullscreenPreview } from '../FullscreenPreview';
vi.mock('react-i18next', () => ({ useTranslation: () => ({ t: (key: string) => key }) }));
vi.mock('@/lib/mermaid/core', () => ({ renderDiagram: async () => ({ svg: '<svg><text>diagram</text></svg>', error: null }) }));
vi.mock('@/lib/mermaid/codeUtils', () => ({ parseDiagram: () => ({}) }));
vi.mock('@/utils/svgPostProcessing', () => ({ postProcessDiagramSvg: (svg: string) => svg }));
afterEach(cleanup);
async function setup() {
  const result = render(<FullscreenPreview content="flowchart TD\nA-->B" onClose={() => {}} />);
  await waitFor(() => expect(result.container.querySelector('.mermaid-container')).not.toBeNull());
  return result;
}
describe('fullscreen interaction regressions', () => {
  it('preserves drag deltas across batched mouse moves', async () => {
    const { container } = await setup();
    const surface = container.querySelector('.preview-grid')!;
    fireEvent.mouseDown(surface, { button: 0, clientX: 10, clientY: 20 });
    act(() => {
      window.dispatchEvent(new MouseEvent('mousemove', { clientX: 40, clientY: 50 }));
      window.dispatchEvent(new MouseEvent('mousemove', { clientX: 90, clientY: 100 }));
    });
    expect((container.querySelector('.mermaid-container') as HTMLElement).style.transform).toContain('translate(80px, 80px)');
    fireEvent.mouseUp(window);
    fireEvent.mouseMove(window, { clientX: 120, clientY: 150 });
    expect((container.querySelector('.mermaid-container') as HTMLElement).style.transform).toContain('translate(80px, 80px)');
  });
  it('allows toolbar zoom beyond 500 percent', async () => {
    const { container, getByText } = await setup();
    const zoomIn = container.querySelectorAll('button')[1];
    for (let i = 0; i < 20; i++) fireEvent.click(zoomIn);
    expect(getByText('600%')).toBeTruthy();
  });
  it('allows keyboard zoom beyond 500 percent and reset', async () => {
    const { getByText } = await setup();
    for (let i = 0; i < 20; i++) fireEvent.keyDown(window, { key: '+' });
    expect(getByText('600%')).toBeTruthy();
    fireEvent.keyDown(window, { key: '0' });
    expect(getByText('100%')).toBeTruthy();
  });
  it('allows wheel zoom beyond 500 percent and retains minimum zoom', async () => {
    const { container, getByText } = await setup();
    const surface = container.querySelector('.preview-grid')!;
    for (let i = 0; i < 60; i++) fireEvent.wheel(surface, { deltaY: -100 });
    expect(getByText('700%')).toBeTruthy();
    for (let i = 0; i < 100; i++) fireEvent.wheel(surface, { deltaY: 100 });
    expect(getByText('10%')).toBeTruthy();
  });
});
