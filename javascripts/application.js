var regex = "a+b";
var nfa = RegexParser.parse(regex);

for (var state in nfa.states) {
  console.log(state);
  console.log(nfa.states[state].transitions);
}

console.log('final states:')
for (var state in nfa.states) {
  if (nfa.states[state].final) {
    console.log(state);
  }
}