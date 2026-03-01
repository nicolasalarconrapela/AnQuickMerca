const fs = require('fs');

let home = fs.readFileSync('src/screens/Home.tsx', 'utf8');

// There's probably a duplicate component or function where `t` is used but not defined
// Check if `t` is used outside of Home component
if (home.includes('function getListTotal')) {
    console.log("Found getListTotal");
}
// Is `t` used inside `getListTotal`? Wait, I didn't replace anything there.
// What about `useTranslation` being in the wrong component?
// Let's print out where `t` is defined.
const lines = home.split('\n');
lines.forEach((line, index) => {
   if (line.includes('const { t')) {
       console.log("t defined at line:", index + 1);
   }
});
