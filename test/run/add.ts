import { add } from "../../src/add";

const result = add(2, 3);
document.getElementById("result")!.textContent = `2 + 3 = ${result}`;

console.log(`add(2, 3) = ${result}`);
