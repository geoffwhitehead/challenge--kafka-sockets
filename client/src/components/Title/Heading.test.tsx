import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';
import { Heading } from './Heading';

let container: Element | null = null;
beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  if (container) {
    unmountComponentAtNode(container);
    container.remove();
  }

  container = null;
});

it('renders with a title', () => {
  act(() => {
    render(<Heading title="Test Title 1" />, container);
  });
  expect(container!.textContent).toBe('Test Title 1');
  act(() => {
    render(<Heading title="Test Title 2" />, container);
  });
  expect(container!.textContent).toBe('Test Title 2');
});

it('renders with a description', () => {
  act(() => {
    render(
      <Heading title="Test Title 1" description="test description 1" />,
      container,
    );
  });
  expect(container!.lastChild?.textContent).toBe('test description 1');
  act(() => {
    render(
      <Heading title="Test Title 2" description="test description 2" />,
      container,
    );
  });
  expect(container!.lastChild?.textContent).toBe('test description 2');
});
