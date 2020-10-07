## Process to parse new DOM
1. Add the new wrongly parsed page in `test/mocks` folder
    Be sure to name the page with `prefix ISODATE.html` prefix should contain `bing` if you want to use bing parser
1. run `npm run generate-mock-data`
1. Edit the newly generated `.json` file to match the real situation (using your own brain and web browser)
1. At this stage `npm run test` shouldn't pass
1. Fix the parser code until `npm run test` pass