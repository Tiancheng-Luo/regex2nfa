var regex = "ab**ab";
var nfa = RegexParser.parse(regex);

for (var state in nfa.states) {
  console.group(state);
  for (var transition in nfa.states[state].transitions) {
    var destinations = nfa.states[state].transitions[transition].map(function(item) {
      return item.label;
    }).join(', ');
    console.log(transition + ' : ' + destinations);
  }
  if (nfa.states[state].final) {
    console.log('-- final state');
  }
  console.groupEnd();
}

console.info('abaab', nfa.accepts('abaab'));
console.info('ababa', nfa.accepts('ababa'));
console.info('ababaaa', nfa.accepts('ababaaa'));