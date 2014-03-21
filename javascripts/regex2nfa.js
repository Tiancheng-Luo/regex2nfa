function RegexParser() {}
RegexParser.parse = function(regex) {
  var nfa = new NFA('ab');
  var emptyContext = nfa.startState();
  var context = emptyContext;
  for (var i = 0; i < regex.length; i++) {
    var symbol = regex.charAt(i);
    if (nfa.alphabetContains(symbol)) {
      emptyContext = nfa.addState();
      var state = nfa.addState();
      context.transition(emptyContext, '~');
      emptyContext.transition(state,  symbol);
      context = state;
    } else if (symbol == '*') {
      context.transition(emptyContext, '~');
      emptyContext.transition(context, '~');
    } else if (symbol == '+') {
      emptyContext = nfa.startState();
      context = emptyContext;
    }
  }
  return nfa;
}





function NFA(alphabet) {
  this.alphabet = alphabet.split('');
  this.states = {};
  this.stateCount = 0;
  this.addState();
}

NFA.prototype.startState = function() {
  return this.states['q0'];
}

NFA.prototype.addState = function(label) {
  label = label || this.generateStateLabel();
  var state = new State(label);
  this.states[label] = state;
  this.stateCount++;
  return state;
}

NFA.prototype.alphabetContains = function(symbol) {
  return this.alphabet.join('').indexOf(symbol) > -1;
}

NFA.prototype.generateStateLabel = function() {
  return 'q' + this.stateCount;
}





function State(label) {
  this.label = label;
  this.transitions = {};
}

State.prototype.transition = function(state, symbol) {
  if (!(symbol in this.transitions)) {
    this.transitions[symbol] = [];
  }
  this.transitions[symbol].push(state);
}