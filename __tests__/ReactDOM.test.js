
import ReactDOM from '../src/react-dom';
import React from '../src/react';
import lazy from 'jasmine-lazy';

const renderingClassComponents = () => {
  describe(
    'rendering a class component that returns html', () => {

    lazy('element', () => {
      return React.createElement(class extends React.Component {
        render() {
          return React.createElement('div');
        }
      });
    });

    beforeEach(() => {
      document.body.innerHTML = '<div id="container"></div>';
    });

    it('renders the element returned by the component', () => {
      expect(
        ReactDOM.render(
          element, document.querySelector("#container")))
        .toEqual(null);

      expect(document.body.innerHTML).toEqual(
        '<div id="container"><div></div></div>'
      );
    });
  });

  describe('setState', () => {
    lazy('buttonId', () => 'some-button-id');
    lazy('component', () => {
      return class extends React.Component {
        constructor(props) {
          super(props);

          this.state = {
            counter: 0
          };
        }

        render() {
          return React.createElement('div', null, [
            React.createElement('button', {
              onClick: () => {
                this.setState({counter: this.state.counter + 1});
              },
              id: this.props.id,
            }, [
              `${this.props.label} Counter: ${this.state.counter}`,
            ]),
            ...this.props.children
          ]);
        }
      };
    });
    lazy('element', () => {
      return React.createElement(component);
    });

    beforeEach(() => {
      jest.spyOn(React.Component.prototype, 'setState');
      document.body.innerHTML = '<div id="container"></div>';
    });

    it('can be called within class', () => {
      expect(
        ReactDOM.render(
          React.createElement(
            component, {id: buttonId, label: 'Outer'}),
          document.querySelector("#container")))
        .toEqual(null);

      document.querySelector(`#${buttonId}`).click();

      expect(React.Component.prototype.setState)
        .toHaveBeenCalledWith({counter: 1});
    });

    it('triggers a re-render', () => {
      expect(
        ReactDOM.render(
          React.createElement(
            component, {id: buttonId, label: 'Outer'}),
          document.querySelector("#container")))
        .toEqual(null);

      expect(document.body.innerHTML).toMatch(`Outer Counter: 0`);

      document.querySelector(`#${buttonId}`).click();

      expect(document.body.innerHTML).toMatch(`Outer Counter: 1`);
    });

    xdescribe('when there are nested class components', () => {
      lazy('nestedComponentButtonId', () => 
        'nested-component-button-id');
      lazy('outerCounterLabel', () => 'Outer');
      lazy('innerCounterLabel', () => 'Inner');

      it('preserves descendant component instances', () => {
        expect(
          ReactDOM.render(
            React.createElement(
              component, 
              {id: buttonId, label: outerCounterLabel},
              [
                React.createElement(
                  component, 
                  {id: nestedComponentButtonId, 
                   label: innerCounterLabel}
                )
              ]
            ),
            document.querySelector("#container")))
          .toEqual(null);

        expect(document.body.innerHTML)
          .toMatch(`${innerCounterLabel} Counter: 0`);

        document.querySelector(`#${nestedComponentButtonId}`).click();

        expect(document.body.innerHTML)
          .toMatch(`${innerCounterLabel} Counter: 1`);
        expect(document.body.innerHTML)
          .toMatch(`${outerCounterLabel} Counter: 0`);

        document.querySelector(`#${buttonId}`).click();

        expect(document.body.innerHTML)
          .toMatch(`${outerCounterLabel} Counter: 1`);
        expect(document.body.innerHTML)
          .toMatch(`${innerCounterLabel} Counter: 1`);
      });
    });
  });

  describe(
    'passing props to class components', () => {

    lazy('id', () => 'some-id');
    lazy('element', () => {
      return React.createElement(class extends React.Component {
        render() {
          return React.createElement('div', {id: this.props.id});
        }
      }, {id});
    });

    beforeEach(() => {
      document.body.innerHTML = '<div id="container"></div>';
    });

    it('renders the element returned by the component', () => {
      expect(
        ReactDOM.render(
          element, document.querySelector("#container")))
        .toEqual(null);

      expect(document.body.innerHTML).toEqual(
        `<div id="container"><div id="${id}"></div></div>`
      );
    });
  });
};

const renderingFunctionalComponents = () => {
  describe(
    'rendering a functional component that returns html', () => {

    lazy('element', () => 
      React.createElement(() => React.createElement('div')));

    beforeEach(() => {
      document.body.innerHTML = '<div id="container"></div>';
    });

    it('renders the element returned by the component', () => {
      expect(
        ReactDOM.render(
          element, document.querySelector("#container")))
        .toEqual(null);

      expect(document.body.innerHTML).toEqual(
        '<div id="container"><div></div></div>'
      );
    });
  });

  describe(
    'nested functional components', () => {

    lazy('element', () => 
      React.createElement(() => 
        React.createElement(() => 
          React.createElement('div'))));

    beforeEach(() => {
      document.body.innerHTML = '<div id="container"></div>';
    });

    it('renders the element returned by the component', () => {
      expect(
        ReactDOM.render(
          element, document.querySelector("#container")))
        .toEqual(null);

      expect(document.body.innerHTML).toEqual(
        '<div id="container"><div></div></div>'
      );
    });
  });

  describe(
    'passing children to functional components', () => {

    lazy('element', () => 
      React.createElement(
        ({children}) => 
          React.createElement('div', null, children)
        , null, ['test'])
    );

    beforeEach(() => {
      document.body.innerHTML = '<div id="container"></div>';
    });

    it('renders the element returned by the component', () => {
      expect(
        ReactDOM.render(
          element, document.querySelector("#container")))
        .toEqual(null);

      expect(document.body.innerHTML).toEqual(
        '<div id="container"><div>test</div></div>'
      );
    });
  });
};

const renderingHtmlElements = () => {
  describe('rendering an html element by itself', () => {
    lazy('element', () => React.createElement('div', null));

    beforeEach(() => {
      document.body.innerHTML = '<div id="container"></div>';
    });

    it('renders the element into the container', () => {
      expect(
        ReactDOM.render(
          element, document.querySelector("#container")))
        .toEqual(null);

      expect(document.body.innerHTML).toEqual(
        '<div id="container"><div></div></div>'
      );
    });
  });

  describe('rendering an html element with props', () => {
    lazy('id', () => 'some-id');
    lazy('className', () => 'some-class-name');
    lazy('element', () => 
      React.createElement('div', {id, className}));

    beforeEach(() => {
      document.body.innerHTML = '<div id="container"></div>';
    });

    it('renders the element into the container', () => {
      expect(
        ReactDOM.render(
          element, document.querySelector("#container")))
        .toEqual(null);

      expect(document.body.innerHTML).toEqual(
        `<div id="container">` 
        + `<div id="${id}" class="${className}"></div></div>`
      );
    });
  });

  describe('rendering an html element with a click handler', () => {
    lazy('onClick', () => jest.fn());
    lazy('id', () => 'some-id');
    lazy('element', () => 
      React.createElement('div', {id, onClick}));

    beforeEach(() => {
      document.body.innerHTML = '<div id="container"></div>';
    });

    it('renders the element into the container', () => {
      expect(
        ReactDOM.render(
          element, document.querySelector("#container")))
        .toEqual(null);

      document.querySelector(`#${id}`).click();
      expect(onClick).toHaveBeenCalled();
    });
  });

  describe('rendering an html element with text', () => {
    lazy('element', () => 
      React.createElement('div', null, ['test']));

    beforeEach(() => {
      document.body.innerHTML = '<div id="container"></div>';
    });

    it('renders the element into the container', () => {
      expect(
        ReactDOM.render(
          element, document.querySelector("#container")))
        .toEqual(null);

      expect(document.body.innerHTML).toEqual(
        '<div id="container"><div>test</div></div>'
      );
    });
  });

  describe(
    'rendering an html element with multiple text children', () => {

    lazy('element', () => 
      React.createElement('div', null, ['test1', 'test2']));

    beforeEach(() => {
      document.body.innerHTML = '<div id="container"></div>';
    });

    it('renders the element into the container', () => {
      expect(
        ReactDOM.render(
          element, document.querySelector("#container")))
        .toEqual(null);

      expect(document.body.innerHTML).toEqual(
        '<div id="container"><div>test1test2</div></div>'
      );
    });
  });

  describe('rendering nested html elements', () => {
    lazy('element', () => 
      React.createElement(
        'div', null, [
          React.createElement('div', null, ['test'])
        ]));

    beforeEach(() => {
      document.body.innerHTML = '<div id="container"></div>';
    });

    it('renders the element into the container', () => {
      expect(
        ReactDOM.render(
          element, document.querySelector("#container")))
        .toEqual(null);

      expect(document.body.innerHTML).toEqual(
        '<div id="container"><div><div>test</div></div></div>'
      );
    });
  });
};

describe('ReactDOM', () => {
  describe('render', () => {
    renderingHtmlElements();
    renderingFunctionalComponents();
    renderingClassComponents();
  });
});

