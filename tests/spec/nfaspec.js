describe('State', function() {
  describe('creating new State', function() {
    var state = new State('q0');

    it('has correct state label', function() {
      expect(state.label).toEqual('q0');
    });

    it('has correct initial transitions', function() {
      expect(state.transitions).toEqual({});
    });

    it('has correct final attribute value', function() {
      expect(state.final).toEqual(false);
    });
  });

  describe('adding state transition', function() {
    var q0 = new State('q0');
    var q1 = new State('q1');
    q0.transition(q1, 'a');

    it('adds destination state to corresponding transitions array', function() {
      var expected = { 'a': [ new State('q1') ] };
      expect(q0.transitions).toEqual(expected);
    });
  });

  describe('finalizing the state', function() {
    var state = new State('q0');
    state.finalize();

    it('sets the state final attribute to true', function() {
      expect(state.final).toEqual(true);
    });
  });

  describe('unfinalizing the state', function() {
    var state = new State('q1');
    state.finalize().unfinalize();

    it('sets the state final attribute to false', function() {
      expect(state.final).toEqual(false);
    });
  });
});

describe('NFA', function() {
  describe('creating new NFA', function() {
    var nfa = new NFA('ab');

    it('has correct alphabet', function() {
      expect(nfa.alphabet).toEqual('ab');
    });

    it('has correct initial states', function() {
      var states = {
        'q0': new State('q0')
      };
      expect(nfa.states).toEqual(states);
    });

    it('has correct states count', function() {
      expect(nfa.statesCount).toEqual(1);
    });

    it('has correct start state', function() {
      var state = new State('q0');
      expect(nfa.startState).toEqual(state);
    });
  });

  describe('adding new state without specified label', function() {
    var nfa = new NFA('ab');

    it('returns the newly-created State object', function() {
      var state = nfa.addState();
      var expected = new State('q1');
      expect(state).toEqual(expected);
    });

    it('adds the new state to the states object', function() {
      var states = {
        'q0': new State('q0'),
        'q1': new State('q1')
      };
      expect(nfa.states).toEqual(states);
    });

    it('correctly updates states count', function() {
      expect(nfa.statesCount).toEqual(2);
    });
  });

  describe('adding new state with specified label', function() {
    var nfa = new NFA('ab');

    it('returns the newly-created State object', function() {
      var state = nfa.addState('q5');
      var expected = new State('q5');
      expect(state).toEqual(expected);
    });

    it('adds the new state to the states object', function() {
      var states = {
        'q0': new State('q0'),
        'q5': new State('q5')
      };
      expect(nfa.states).toEqual(states);
    });

    it('correctly updates states count', function() {
      expect(nfa.statesCount).toEqual(2);
    });
  });

  describe('getting a state with a label', function() {
    var nfa = new NFA('ab');

    it('returns the correct requested state', function() {
      var state = nfa.getState('q0');
      var expected = new State('q0');
      expect(state).toEqual(expected);
    });
  });

  describe('getting the start state', function() {
    var nfa = new NFA('ab');

    it('returns the correct start state', function() {
      var state = nfa.getStartState();
      var expected = new State('q0');
      expect(state).toEqual(expected);
    });
  });

  describe('setting the start state', function() {
    var nfa = new NFA('ab');

    it('correctly updates the start state', function() {
      var state = nfa.addState();
      nfa.setStartState(state);
      expect(nfa.getStartState()).toEqual(state);
    });
  });

  describe('getting the final states', function() {
    var nfa = new NFA('ab');

    it('returns empty array if no final states', function() {
      var states = nfa.getFinalStates();
      expect(states).toEqual([]);
    });

    it('returns array of final states', function() {
      nfa.states['q0'].finalize();
      var states = nfa.getFinalStates();
      var state = new State('q0');
      state.finalize();
      expect(states).toEqual([state]);
    });
  });

  describe('checking alphabet contents', function() {
    var nfa = new NFA('ab');

    it('returns true for symbols in the alphabet', function() {
      expect(nfa.alphabetContains('a')).toEqual(true);
      expect(nfa.alphabetContains('b')).toEqual(true);
    });

    it('returns false for symbols not in the alphabet', function() {
      expect(nfa.alphabetContains('c')).toEqual(false);
      expect(nfa.alphabetContains('d')).toEqual(false);
      expect(nfa.alphabetContains('e')).toEqual(false);
    });
  });

  describe('generating state label', function() {
    var nfa = new NFA('ab');

    it('returns the correct state label', function() {
      expect(nfa.generateStateLabel()).toEqual('q1');

      nfa.states['q1'] = new State('q1');
      nfa.statesCount++;
      expect(nfa.generateStateLabel()).toEqual('q2');
    });
  });

  describe('NFA concatenation', function() {
    var nfa1 = new NFA('ab');
    var q1 = nfa1.addState();
    nfa1.getStartState().transition(q1.finalize(), 'a');

    var nfa2 = new NFA('ab');
    var q2 = nfa2.addState();
    nfa2.getStartState().transition(q2.finalize(), 'b');

    nfa1.concatenate(nfa2);

    it('has correct resulting states', function() {
      var i = 0;
      for (var label in nfa1.states) {
        expect(nfa1.states[label].label).toEqual('q' + i++);
      }
      expect(i).toEqual(4);
    });

    it('has correct state transitions', function() {
      var q0 = new State('q0');
      var q1 = new State('q1');
      var q2 = new State('q2');
      var q3 = new State('q3');

      q0.transition(q1, 'a');
      q1.transition(q2, '~');
      q2.transition(q3, 'b');
      q3.finalize();

      expect(nfa1.getState('q0')).toEqual(q0);
      expect(nfa1.getState('q1')).toEqual(q1);
      expect(nfa1.getState('q2')).toEqual(q2);
      expect(nfa1.getState('q3')).toEqual(q3);
    });

    it('has correct start state', function() {
      expect(nfa1.getStartState().label).toEqual('q0');
    });

    it('has correct final states', function() {
      var states = nfa1.getFinalStates();
      expect(states.length).toEqual(1);
      expect(states[0].label).toEqual('q3');
    });
  });

  describe('absorbing NFA', function() {
    var nfa1 = new NFA('ab');
    var q1 = nfa1.addState();
    nfa1.getStartState().transition(q1.finalize(), 'a');

    var nfa2 = new NFA('ab');
    var q2 = nfa2.addState();
    nfa2.getStartState().transition(q2.finalize(), 'b');

    nfa1.absorb(nfa2);

    it('has correct resulting states', function() {
      var i = 0;
      for (var label in nfa1.states) {
        expect(nfa1.states[label].label).toEqual('q' + i++);
      }
      expect(i).toEqual(4);
    });

    it('has correct state transitions', function() {
      var q0 = new State('q0');
      var q1 = new State('q1');
      var q2 = new State('q2');
      var q3 = new State('q3');

      q0.transition(q1, 'a');
      q1.finalize();
      q2.transition(q3, 'b');
      q3.finalize();

      expect(nfa1.getState('q0')).toEqual(q0);
      expect(nfa1.getState('q1')).toEqual(q1);
      expect(nfa1.getState('q2')).toEqual(q2);
      expect(nfa1.getState('q3')).toEqual(q3);
    });

    it('has correct start state', function() {
      expect(nfa1.getStartState().label).toEqual('q0');
    });

    it('has correct final states', function() {
      var states = nfa1.getFinalStates();
      expect(states.length).toEqual(2);
      expect(states[0].label).toEqual('q1');
      expect(states[1].label).toEqual('q3');
    });
  });

  describe('accepting input strings ( ab*ba )', function() {
    var nfa = new NFA('ab');
    var q0 = nfa.getStartState();
    var q1 = nfa.addState();
    var q2 = nfa.addState();
    var q3 = nfa.addState();
    var q4 = nfa.addState();
    var q5 = nfa.addState();
    var q6 = nfa.addState();
    var q7 = nfa.addState();

    q0.transition(q1, 'a');
    q1.transition(q2, '~');
    q2.transition(q3, 'b').transition(q4, '~');
    q3.transition(q2, '~').transition(q4, '~');
    q4.transition(q5, 'b');
    q5.transition(q6, '~' );
    q6.transition(q7, 'a');
    q7.finalize();

    it('accepts aba', function() {
      expect(nfa.accepts('aba')).toEqual(true);
    });

    it('accepts abba', function() {
      expect(nfa.accepts('abba')).toEqual(true);
    });

    it('accepts abbbbbba', function() {
      expect(nfa.accepts('abba')).toEqual(true);
    });

    it('does not accept aa', function() {
      expect(nfa.accepts('aa')).toEqual(false);
    });

    it('does not accept ababa', function() {
      expect(nfa.accepts('ababa')).toEqual(false);
    });
  });
});