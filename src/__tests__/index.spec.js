const createClassNames = require('../index');

describe('createClassNames', () => {
  const mockBase = {
    container: 'container',
    alert: 'alert',
    text: 'text',
  };

  it('returns a new object', () => {
    expect(createClassNames(mockBase)).not.toBe(mockBase);
  });

  it('only a base value is given', () => {
    expect(createClassNames(mockBase)).toEqual({
      container: 'container',
      alert: 'alert',
      text: 'text',
    });
  });

  it('extensions object is given with non-string values', () => {
    const extensions = {
      container: null,
      alert: undefined,
      text: [],
    };

    expect(createClassNames(mockBase, extensions)).toEqual({
      alert: 'alert',
      container: 'container',
      text: 'text',
    });
  });

  it('extensions object has properties that do not exist on the base object', () => {
    const extensions = {
      nonExistant: 'wheee',
    };

    expect(createClassNames(mockBase, extensions)).toEqual({
      alert: 'alert',
      container: 'container',
      text: 'text',
    });
  });

  it('extensions object is given values to extend', () => {
    const extensions = {
      container: 'layoutContainer',
      alert: undefined,
      text: 'moreText',
    };

    expect(createClassNames(mockBase, extensions)).toEqual({
      container: 'container layoutContainer',
      alert: 'alert',
      text: 'text moreText',
    });
  });

  it('custom merge function is given', () => {
    const extensions = {
      container: 'layoutContainer',
      alert: undefined,
      text: 'moreText',
    };

    const merge = srcValue => srcValue;

    expect(createClassNames(mockBase, extensions, merge)).toEqual({
      container: 'layoutContainer',
      alert: undefined,
      text: 'moreText',
    });
  });

  it('custom merge function is given for one property', () => {
    const extensions = {
      container: () => 'overriddenLayout',
      text: 'moreText',
    };

    expect(createClassNames(mockBase, extensions)).toEqual({
      container: 'overriddenLayout',
      alert: 'alert',
      text: 'text moreText',
    });
  });

  it('custom merge function is given for one property and a default merge function', () => {
    const extensions = {
      container: () => 'overriddenLayout',
      alert: undefined,
      text: 'moreText',
    };

    const merge = srcValue => srcValue;

    expect(createClassNames(mockBase, extensions, merge)).toEqual({
      container: 'overriddenLayout',
      alert: undefined,
      text: 'moreText',
    });
  });
});
