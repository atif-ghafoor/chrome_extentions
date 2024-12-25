console.log("extention is running?");
const bodyElement = document.querySelectorAll("p");
console.log(bodyElement);
for (elt of bodyElement) {
  elt.style["backgroundColor"] = "pink";
}
