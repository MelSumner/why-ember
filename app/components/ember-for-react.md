The [original document](https://www.notion.so/Ember-For-React-Developers-556a5d343cfb4f8dab1f4d631c05c95b) has been published with permission, and modified slightly for this site.

Conceptually, both React and Ember can provide the solutions to the same problems. React has historically only been the component layer of applications, but that is changing as React evolves, and gradually adds more features that aim to make developing applications with React more pleasant. Ember offers a bit more out of the box, and aims to have a solution or pattern for most situations – with additional tooling, conventions, architectural patterns. The goal is to abstract away the menial differences between apps and reduce friction when switching projects.

![React is only Components](./images/efrd-001.png)

React is *mostly* components. Interactions with external services such as [Redux](https://redux.js.org/), [GraphQL](https://graphql.org/) or [Orbit.js](https://orbitjs.com/) happen through components backed by a *[Context](https://reactjs.org/docs/context.html)* which we'll dive into in a bit.

![Ember connects to data via Services](./images/efrd-002.png)

Ember has architectural patterns for dealing with specific interactions. Third party services are always interfaced with an Ember *[Service](https://guides.emberjs.com/release/applications/services/)*. Services are used for a lot more than just 3rd party library integrations. A Service is a [singleton](https://en.wikipedia.org/wiki/Singleton_pattern); it lives for the duration of the application. Ember has object types other than services.

## Components

Both Ember and React use *components* as the foundational building block for web apps, and Ember and React components have a lot in common. There are a couple important differences between components in the two frameworks you should know about, though!

Before going further, please consider pausing and taking some time to familiarize yourself with Ember's Components! Check out the [Ember Guides on Components](https://guides.emberjs.com/release/components/defining-a-component/) for a deep dive!

The first major difference is that React Components can be defined using either JavaScript *classes* or *functions*, whereas the equivalents in Ember are *class-backed components* (which use a JavaScript class) and *template-only components* (which do not use JavaScript at all). This separation is a reflection of the second major difference between React and Ember components: how the rendered HTML is defined. React components use [JSX](https://en.wikipedia.org/wiki/React_(JavaScript_library)#JSX) and Ember uses [Templates](https://guides.emberjs.com/release/templates/handlebars-basics/) – sometimes in addition to a backing JavaScript file.

Some of the reasons for using a templating language over "just JavaScript"™ are discussed here in this [video from ReactiveConf](https://www.youtube.com/watch?v=nXCSloXZ-wc&t=1441s). There are other reasons as well, but they are beyond the scope of this guide.

Like React, Ember makes heavy use of ideas from both [functional programming](https://en.wikipedia.org/wiki/Functional_programming) and [object-oriented programming](https://en.wikipedia.org/wiki/Object-oriented_programming), though you'll find they show up in different ways!

### Component Patterns

#### Presentational or "Stateless" Component

Presentational components only display or format data. They do not have state, do not make requests, and do not cause side-effects within the app without being passed a function to do so.

Presentational components are one half of a common design pattern in component-driven interfaces, where behavior is separated from what displays the result of the behavior. These are most commonly referred to as container and presentational components. However, a container component with state does not need to exist in order to use a presentational component. A presentational component could be thought of as a [Pure Function](https://en.wikipedia.org/wiki/Pure_function) in that the output is always the same for any given set of inputs. The presentational component may have logic for controlling what is displayed when, but it does not maintain the state that backs the logic. Icon component libraries, such as those provided by [Font Awesome](https://github.com/FortAwesome) are entirely presentational.

The example below shows a logic-less, presentational component that will be rendered with some static data:

```jsx
// presentation.jsx

import React from 'react';

export function Presentation({ message, response }) {
  return (
    <>
      Obi Wan Kenobi: {message}
      General Grievous: {response}
    </> 
  );
}
```

```jsx
// invocation.jsx

<Presentation
  message={'Hello There!'}
  response={'General Kenobi!!'}
/>
```

In `presentation.jsx` the component receives two arguments which are then rendered. We see that in `invocation.jsx` those arguments are assigned to static values, so the rendered result will be:

Obi Wan Kenobi: Hello There!
General Grievous: General Kenobi!!

The same pattern would be written this way in Ember:

```html
<!-- presentation/template.hbs -->

Obi Wan Kenobi: {{@message}}
General Grievous: {{@response}}
```

```html
<!-- invocation/template.hbs -->

<Presentation 
  @message='Hello There!' 
  @response='General Kenobi!!'
/>
```

#### Container Component

Container components provide functionality to the wrapping content without adding any markup to the DOM. These are also known as "Renderless Components". They may also be higher-order components, but in React, a Higher-Order Component is a little more specific than the Container component concept.

The following example may be something used to manage the open or closed state of a modal.

```jsx
// modal-state.jsx

import React, { useState, useCallback } from 'react';

export function ModalState({ children }) {
  const [isActive, setIsActive] = useState(false);
  const toggle = useCallback(() => setIsActive(!isActive), [isActive]);
  const close = () => setIsActive(false);
  const open = () => setIsActive(true);
  
  return children({
    isActive,
    actions: {
      toggle, close, open
    }
  });
}
```

Using React's hooks, we just set up some state and callbacks to provide to any child components that may want to use an open/close state.

```jsx
// usage.jsx

<ModalState>
  {({ isActive, actions }) => {
    return (
      <AskAQuestion isActive={isActive} close={actions.close} />
    );
  }}
</ModalState>
```

This uses the [render-props](https://reactjs.org/docs/render-props.html) pattern, which has no Ember equivalent, but when looking at this as only a container component, there is a pattern Ember provides that *looks* somewhat similar.

```jsx
// components/modal-state.js

import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class ModalState extends Component {
  @tracked isActive = false;
  
  @action toggle() { this.isActive = !this.isActive; }
  @action close() { this.isActive = false; }
  @action open() { this.isActive = true; }
}
```

‌First though, there are a number of things different about this component than in the previous example. By default, there can be two files to a component, although this is not a requirement. In the first example, there was just the template file, as there was no backing state. Here, we have a JavaScript file in addition to the template file. Ember's components are class-based, just like how React's stateful components used to be before hooks were introduced.

Some important details to note about the component class definition:

1. The component class must be the default export.
2. The `@tracked` decorator *tracks* changes to the `isActive` property, so that when it changes, the parts of the template that use `isActive` will update. This convention means that if you *don't* use `@tracked` you can manage state without fear of causing unnecessary updates to the template.
3. There is no "state" property to manage the component's state on. The component has a very lightweight API with only 2 lifecycle hooks and 3 properties, [see documentation](https://api.emberjs.com/ember/release/modules/@glimmer%2Fcomponent). Note that when state is set, such as on in the methods decorated with `@action`, we can do so using *native* JavaScript. No need for `this.setState` as there was on React classes.
4. The `@action` decorator binds the method to the class instance. This is done for the same reason that back in React classes, everyone was assigning methods to instance properties via arrow functions.

```jsx
// Specifically, the React class equivalent of 
open = () => this.setState({ isActive: true });
// is
@action open() { this.isActive = true; }
// in Ember.
```

Coming back to the `modal-state` component, we have the template:

```html
<!-- components/modal-state.hbs -->

{{yield
  this.isActive
  (hash
    toggle=this.toggle
    close=this.close
    open=this.open
  )
}}
```

The component *yields* to the calling context. The `yield` keyword will provide a list of whatever you want to the calling context. In this list, the first element is the value of `this.isActive` and in the second element, we run in to the `hash` helper. Ember Templates aren't JavaScript (and that'll be covered later), but in order to create an object in a template, we must use the `hash` helper to aid us in creating an object to yield back to the template.

The above yielded content is referenced below in the calling context via the block parameters located after the `as` keyword.

```html
<ModalState as |isActive actions|>
  <AskAQuestion 
    @isActive={{isActive}}
    @close={{actions.close}}
  />
</ModalState>
```

#### Higher-Order Component

Higher-Order components are functions that take a component as an argument and return a new component wrapping the passed component with some additional functionality.

Ember doesn't have a higher-order components or anything similar to what exists in React. The closest *behavior* you can achieve with Ember is using Container Components. The downside is that you have to be slightly more verbose with your reuse as you need to specify the argument keys in addition to the value, where as with higher-order components in react, they are *implicitly* given to your wrapped component.

```html
<ModalState as |isActive actions|>
  <AskAQuestion 
    @isActive={{isActive}}
    @close={{actions.close}}
  />
</ModalState>
```

Looking back at the `ModalState` component, this is as close to higher-order components that Ember can get. For comparison, in React, the above could be represented in React as a higher-order component like this:

```jsx
export function withModalState(WrappedComponent) {
  export function ModalState({ children }) {
    // state management omitted
    return (
      <WrappedComponent { ...{
        isActive,
        actions: {
          toggle, close, open
        }
      }} />
    );
  }
}

// elsewhere
export default withModalState(MyModal);
```

However, this use of higher-order components makes it hard to track down where props are coming from, and is, in-part, why React has been encouraging hooks -- but also why Ember has not adopted this pattern. Ember is striving for code to be discoverable, especially to those who may be unfamiliar with Ember in general -- the desire is to have good "go to definition"-ability, and higher-order functions would detract from that.

### Component Patterns not in React‌

#### Contextual Components

Applies markup or surrounding behavior to content.‌

Contextual components are useful when you have a set of components that need to be used together, and you want consistent invocation / style / interaction between that set of components.

```html
<!-- components/card.hbs -->

<div class='material-card'>
  {{yield (
    hash
      Title=(component 'card-title')
      Footer=(component 'card-footer')
      Content=(component 'card-content')
    )
  }}
</div>
```

```html
<!-- Usage -->

<Card as |card|>
  <card.Title>A Card!</card.Title>
  <card.Content>
    Some content for the card
  </card.Content>
  <card.Footer>
    maybe a <button>or other action</button>
  <card.Footer>
</Card>
```

This can somewhat be faked in React's component system, as the components are nothing more than module exports. We can tack on the related components as static properties to the main export of a component. [See "Compound Components"](https://kentcdodds.com/blog/compound-components-with-react-hooks)

```jsx
// imports and component definitions omitted

Card.Title = CardTitle;
Card.Footer = CardFooter;
Card.Content = CardContent;

export default Card;
```

Though, even with assigning sub-components to the default export, a user must rely on documentation to know about how these sub-components are accessed. In order to achieve the best sub-component suggestion you'd have to user [render-props.](https://reactjs.org/docs/render-props.html) Render props are a technique of passing a prop to a component and invoking that.‌

### Templates and JSX

Templates in Ember are not *Just JavaScript* like JSX is. Ember templates are *just* HTML, or rather a superset of HTML. One of the benefits of JSX is that by leveraging JavaScript, it's very clear where variables and event handlers come from. In larger components being able to "Go-to definition" by either hotkey or click combination to find the definition of the property or function is essential to learning the flow of data. An IDE or editor's support of this kind of discovery comes natural with *just* JavaScript support.

With Ember, since there is a whole *framework* of features baked in, the IDE or editor needs a couple additional plugins in order to achieve the same experience.

- [Ember Language Server](https://marketplace.visualstudio.com/items?itemName=lifeart.vscode-ember-unstable)
- [Handlebars](https://marketplace.visualstudio.com/items?itemName=andrejunges.Handlebars) (subset of ember's templating language)‌

Aside from editor-feature differences, there are a number of technical reasons that Ember uses templates over JavaScript.‌

- Templates are statically analyzable and can be transformed / modified at build time.
- Templates are compiled down to a binary format that makes the compiled size much smaller than gzipped and minified JavaScript. The binary format also allows for the user's browser to read and evaluate the template much faster than JavaScript as JavaScript needs to be parsed and compiled by the browser before it can be evaluated.
- Templates allow you to use all the features of the web.
- Templates are a superset of HTML
- `...attributes` allow you to separate html attributes from component arguments.
- all attributes you'd find in HTML or SVG documentation *just work*. No need to try to translate anything in your head before you write it.

For more information on the benefits of the templating language that ember uses, there is this talk that Tom Dale gave at [ReactiveConf 2017: Secrets of the Glimmer VM](https://www.youtube.com/watch?v=nXCSloXZ-wc).

## Application State Management

### Context Provider and Consumer

React, by default, comes with its own way to manage application state in a ergonomic component-driven solution. For comparison, below is an example of using React's Context Provider and Consumer that might be used to build out a "to-do" management app.

```jsx
const TodosContext = React.createContext();

/* actions, types, other constants, etc omitted */
function reducer(state, action) { /* ... */ }

function TodosProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  
  return (
    <TodosContext.Provider
      value={{
        ...state,
        add: (text) => dispatch({ type: ADD, text }),
        destroy: (id) => dispatch({ type: DESTROY, id }),
        // ...
      }}
    >
      {children}
    </TodosContext.Provider>
  );
}
```

As long as the `TodosProvider` is somewhere in the ancestry of the component that wishes to to consume the data from the provider, there are two ways to access the `TodosContext` data: render props and `useContext`.‌

**Render Props**

```jsx
<TodosContext.Consumer>
  {({ todos, add, edit }) => {
    return (/* template stuff */);
  }}
</TodosContext.Consumer>
```

Render props do not have a correlation in Ember, because Ember doesn't have a corollary to the Provider and Consumer pattern.

### Ember's bundled application state: The Service

```jsx
export default class TodosService extends Service {
  @tracked todos = [];
  
  add(text) {
    this.todos = this.todos.concat({
      id: uuid(),
      completed: false,
      text,
    });
  }
  
  destroyTodo(id) {
    this.todos = this.todos.filter(todo => todo.id !== id);
  }
  
  // ...
}
```

### Redux

Redux is react-independent and can work with Ember via a connection library, just like React's [react-redux](https://react-redux.js.org/). [ember-redux](https://github.com/ember-redux/ember-redux) offers all of the same features that react-redux does and is clear about many of the same patterns; namely the Container and Presentation Component pattern and how to compose them together. With ember-redux, you'll be able to get time-travel debugging as you can use the same redux developer tools browser extension you've been using with react.

## Project Layout

Coming Soon! But TL;DR...Ember handles this for you, for the most part. If you want to customize it you can, but this is a really boring topic and most Ember users are happy to let Ember handle these details. Check out all of the generators that are in ember-cli, you'll be pleasantly surprised!

## Styles‌

### CSS-in-JS

CSS-in-JS is an anti-pattern, and should be avoided. If you really want to do this, though, there's probably an ember addon for that.

## Common Questions (with answers)

### Should components load or interact with data directly?

It depends, but for the most part, it's fine. Ask on the Ember Discord server for more information about this.

### Does Ember have an equivalent of PropTypes?

Sort of. There is an addon called [ember-prop-types](https://github.com/ciena-blueplanet/ember-prop-types), which works the exact same way as [react's prop-types](https://reactjs.org/docs/typechecking-with-proptypes.html). But as Ember is moving towards more aspects of the framework being statically analyzable (in addition to recommending against mixins, which is how ember-prop-types work), prop-types will no longer be an option. With the rise of typescript and with the ember plugins/extensions for your editor of choice, you'll still be notified of component / type misuse. Type checking at code/build time has the advantage of a quicker feedback loop, as you don't need to wait for your browser tab to update.

### Why use Dependency Injection when I can "just use a module"?‌

See: [Dependency Injection](https://guides.emberjs.com/release/applications/dependency-injection/)

### Why can't I use Jest for testing?

For the most part, there hasn't been enough interest. There is no technical reason why using Jest wouldn't work, but as is mentioned by the [Ember Guides’ page on testing](https://guides.emberjs.com/release/testing/), QUnit is the default testing framework, and mocha is supported through an addon called [ember-mocha](https://github.com/emberjs/ember-mocha). To use Jest with ember, someone would need to write an addon similar to ember-mocha that provides all the necessary integrations between Jest and Ember.‌

### Do I have to use ember-data?

Nope! You can use `fetch` or any other way of getting data from an API. The `[model](https://guides.emberjs.com/release/routing/specifying-a-routes-model/)` hook in an ember route is intended for only loading the minimally required data to render a route.

```jsx
import Route from '@ember/routing/route';

export default class ProfileRoute extends Route {
  async model() {
    const response = await fetch('https://swapi.co/api/people/3/');
    const json = await response.json();
    
    return { profile: json };
  }
}
```

If you need to interact with an API from a component, there is a library called [ember-concurrency](http://ember-concurrency.com/) which is the community-adopted, canonical way to deal with async behavior, not just in components, but throughout your Ember application.

```jsx
// components/my-component.js

import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency';

export default class MyComponent extends Component {
  @tracked email;
  
  @(task(function*() {
    yield fetch('https://some.api/profiles/3', {
      method: 'POST',
      body: JSON.stringify({ email })
    }
  }).drop())
  updateProfile;
}
```

The function passed to the `@task` decorator is a generator function, which may be familiar if you've used [redux-saga](https://github.com/redux-saga/redux-saga). The big advantage here is that instead of having your saga dispatch multiple redux actions to manage pending / running, result, and error states, all the state is encapsulated within the task function's returned [TaskInstance](http://ember-concurrency.com/api/TaskInstance.html).

```html
<!-- components/my-component.hbs -->

{{#if this.updateProfile.error}}
  <div class='error'>{{this.updateProfile.error}}</div>
{{/if}}

<Input @value={{this.email}} />

<button 
  {{on 'click' (perform this.updateProfile}}
  disabled={{this.updateProfile.isRunning}}
>
  Update Profile
</button>
```

Within the template, we can access all the properties on the TaskInstance and conditionally display those properties. This is a overall a huge improvement over redux-sagas, as it eliminates all boilerplate, and lets you focus on the behavior that matters to you -- preventing very fast clicks from causing multiple quick api requests, connecting to websockets -- anything where concurrency could be an issue. Here is a great collection of demonstrations of the types of concurrency that that ember-concurrency simplifies: [http://ember-concurrency.com/docs/task-concurrency](http://ember-concurrency.com/docs/task-concurrency).

### What is JSON:API?

A specification for relational data that is intended for programs to be totally aware of relationships, pagination, how to fetch related resources, and provides a way of building a graph representing the resources in your API. It also provides all the features of the GraphQL specification, except that there isn't (yet) a schema or recommended way to use JSON:API over websockets.

More information can be found at [https://jsonapi.org](https://jsonapi.org/).

### Using ember-data, what if my API isn't a JSON:API?

While using JSON:API provides the most seamless integration with ember-data, ember-data provides a translation layer for converting *any* resource-based API to models.

Diagram of data-flow between ember-data's cache store and a remote API.

Why would you want to use ember-data if your API doesn't immediately work by default with it? ember-data gives you an abstraction for querying, updating, deleting, and managing cache for your API resources.

From the official Ember guides on ember-data: [Customizing Adapters](https://guides.emberjs.com/release/models/customizing-adapters/) & [Customizing Serializers](https://guides.emberjs.com/release/models/customizing-serializers/)

![Adapters and Serializers](./images/efrd-003.png)

### Can I use GraphQL?

Yes! There is an addon called [ember-apollo-client](https://github.com/bgentry/ember-apollo-client), and there is working being done in ember-data itself to support any kind of API, such as GraphQL.
