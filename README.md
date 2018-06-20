# create-class-names

[![build status](https://img.shields.io/travis/hswolff/create-class-names/master.svg?style=flat-square)](https://travis-ci.org/hswolff/create-class-names)
[![npm version](https://img.shields.io/npm/v/create-class-names.svg?style=flat-square)](https://www.npmjs.com/package/create-class-names)
[![npm downloads](https://img.shields.io/npm/dm/create-class-names.svg?style=flat-square)](https://www.npmjs.com/package/create-class-names)

A utility to define an API for assigning custom classNames to nested elements in a React Component.

Useful for global styles, css-modules, and css-in-js.

Note: This is not a replacement for the very awesome [classnames](https://github.com/JedWatson/classnames) library. This is meant to be used in conjunction with classnames. Think of this library as a way to combine usages of classnames.

## What is this?

Commonly React developers will manually expose a `className` prop to their React Component to allow users of that component to customize the style. Also it's very common to use [classnames](https://github.com/JedWatson/classnames) to concatenate those classNames.

```js
function Banner(props) {
  const { children, className } = props;
  return (
    <div className={classNames('container', className)}>
      <span className="alert">&#x26a0;</span>
      <div className="text">{children}</div>
    </div>
  );
}
```

However if you want to expose the ability to customize the className for a child component, there's no clear way to do that. A common method is to expose another `prop`, such as `textClassName`.

```js
function Banner(props) {
  const { children, textClassName } = props;
  return (
    <div className={classNames('container', className)}>
      <span className="alert">&#x26a0;</span>
      <div className={classNames('text', textClassName)}>{children}</div>
    </div>
  );
}
```

However this approach doesn't scale well.

## Use a theme object

A more structured way to solve this is to use a theme object.

```js
function Banner(props) {
  const { children, theme } = props;
  return (
    <div className={theme.container}>
      <span className={theme.alert}>&#x26a0;</span>
      <div className={theme.text}>
        <span className={theme.innerText}>{children}</span>
      </div>
    </div>
  );
}

Banner.defaultProps = {
  theme: {
    container: 'globalContainerClassName',
  },
};
```

This allows parent componets to customize what classNames are given however it then becomes difficult to keep the default classNames.

```js
const Page = () => (
  <Banner
    theme={{
      container: 'customContainerClass',
    }}
    {/* This removes the default className */}
  />
);
```

However keeping the default value is very cumbersome.

```js
const Page = () => (
  <Banner
    theme={{
      container: `${Banner.defaultProps.theme.container} customContainerClass`,
    }}
  />
);
```

That's where `createClassNames` comes to the rescue!

## Usage

```js
const base = {
  container: 'container',
};

// 1. This is essentially a shallow clone of base.
const result = createClassNames(base);

assert.deepEquals(result, {
  container: 'container',
});

// 2. Extend the base classNames.
// If the extended values are not strings then they are ignored.
const result = createClassNames(base, {
  container: 'pageContainer',
});

assert.deepEquals(result, {
  container: 'container pageContainer',
});

// 3. Provide a default custom merge function.
const result = createClassNames(
  base,
  {
    container: 'pageContainer',
  },
  (val, baseVal, key, result) => {
    return val;
  }
);

assert.deepEquals(result, {
  container: 'pageContainer',
});

// 4. Provide a custom merge behavior per property.
const result = createClassNames(base, {
  container: (baseVal, key, result) => {
    return `${baseVal} ${baseVal}`;
  },
});

assert.deepEquals(result, {
  container: 'container container',
});
```

## Example

Live demo on Codesandbox.

[![Edit createClassNames Demo](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/13zn2oj594)

A more in depth example with React.

```js
// With css-modules
import styles from './Banner.css';
const baseStyles = styles;

// With global styles
const baseStyles = {
  container: 'container',
  alert: 'alert',
  text: 'text',
  // Empty string here because there is no base styles but you want
  // to allow parent components the ability to customize that element.
  innerText: '',
};

function Banner(props) {
  const { children, theme } = props;

  // Merges base and theme className values onto the same property.
  const theme = createClassNames(baseStyles, theme);

  return (
    <div className={theme.container}>
      <span className={theme.alert}>&#x26a0;</span>
      <div className={theme.text}>
        <span className={theme.innerText}>{children}</span>
      </div>
    </div>
  );
}

const Page = () => (
    {/* Just uses default styles */}
    <Banner>Default Styles</Banner>

    {/* Customizing classNames */}
    <Banner
      theme={{
        container: 'secondBanner',
        alert: 'secondBannerAlert',
        innerText: 'secondBannerInnerText'
      }}
    >
      Custom Styles
    </Banner>

    {/*
        If you pass a function as a value for a property then you can customize
        what resulting className is given.
    */}
    <Banner
      theme={{
        container: (baseStyleValue, key, result) => {
            // baseStyleValue === 'container'
            // key === 'container'
            // result === the resulting theme object
            return 'secondBanner';
        }
      }}
    >
      Over-riding container style
    </Banner>
)
```
