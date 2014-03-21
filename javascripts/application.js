var regex = "a*b*";
var nfa = RegexParser.parse(regex);

for (var state in nfa.states) {
  console.log(state);
  console.log(nfa.states[state].transitions);
}