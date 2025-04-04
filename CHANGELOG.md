# Change Log

All notable changes to the "jsx-self-closing-tag" extension will be documented in this file.

## [Unreleased]

- jsx in markdown file
- bundle size （esm?）

## [2.1.0] - 2025-04-04

### Refactor

- Refactored the processor by babel to improve performance and compatibility
- Restrict the file type scope to only support the determination of JSX, TSX, and JSX/TSX code blocks within Markdown
  files.

> My test case

```jsx


export default function(){


return <div>

<App id={1}>   </App>
<div id="x" icon={<App></App>}></div>


<App></App>


<div> 
</div>
<div>  </div>
<App     
></App>

<my-tag></my-tag>

<For.Bar></For.Bar>


<h1

>
</h1>


<App/>


</div>

}

function App({id}) {

    return (
        <div>
        <h1>My React App</h1>
        <p>It's working!</p>
        </div>
    );
}
```

## [1.0.2] - 2024-01-25

### Fixed

- Improved tag self-closing matching logic to support tags with attributes
- Added support for tags with line breaks and spaces between opening and closing tags

## [1.0.1] - 2024-01-25

### Chore

- Removed unused commands
- Updated plugin logo

### Docs

- Updated documentation introduction and image resource location

### Update

- Added support for whitespace characters before '/'

## [1.0.0] - 2024-01-24

### Added

- Basic functionality

