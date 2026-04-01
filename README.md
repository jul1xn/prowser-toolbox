# Prowser Toolbox
My own toolbox website to do certain actions and not go from site to site

## How to add new tools

1. Define tool and its properties in `constants.js`
2. Create an ejs page in the `views/toolbox` folder based on the template file
3. In the file, you only have to enter what the user has to do and its output. You can use Bootstrap for styling plus additional styling you can add yourself.

## How to add custom logic and styling to tools

### To add custom logic (javascript) to a tool, you do the following:
1. Create a new javascript file in `public/js` and name it appropriately.
2. Reference it in the `constants.js` file as shown below. It will automaticly get added to the tool's page.
```
{
    name: "<NAME>",
    description: "<DESCRIPTION>",
    url: "<URL>",
    view: "<URL>",
    javascript: "<MY JAVASCRIPT FILE>.js" <-- HERE
}
```

### To add custom styling to a page, you do the following:
1. Create a new css file in `public/css` and name it appropriately.
2. Reference it in the `constants.js` file as shown below. It will automaticly get added to the tool's page.
```
{
    name: "<NAME>",
    description: "<DESCRIPTION>",
    url: "<URL>",
    view: "<URL>",
    css: "<MY CSS FILE>.css" <-- HERE
}
```
