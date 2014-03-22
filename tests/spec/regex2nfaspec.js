describe('RegexParser', function() {
  it('parses empty regex', function() {
    var parsed = RegexParser.parse('');
    var nfa = new NFA('ab');
    nfa.startState().finalize();

    expect(parsed).toEqual(nfa);
  });

  it('parses abba', function() {
    var parsed = RegexParser.parse('abba');
    var nfa = new NFA('ab');
    var q0 = nfa.startState();
    var q1 = nfa.addState();
    var q2 = nfa.addState();
    var q3 = nfa.addState();
    var q4 = nfa.addState();
    var q5 = nfa.addState();
    var q6 = nfa.addState();
    var q7 = nfa.addState();
    var q8 = nfa.addState();

    q0.transition(q1, '~');
    q1.transition(q2, 'a');
    q2.transition(q3, '~');
    q3.transition(q4, 'b');
    q4.transition(q5, '~');
    q5.transition(q6, 'b');
    q6.transition(q7, '~');
    q7.transition(q8, 'a');
    q8.finalize();

    expect(parsed).toEqual(nfa);
  });

  it('parses a*b', function() {
    var parsed = RegexParser.parse('a*b');
    var nfa = new NFA('ab');
    var q0 = nfa.startState();
    var q1 = nfa.addState();
    var q2 = nfa.addState();
    var q3 = nfa.addState();
    var q4 = nfa.addState();

    q0.transition(q1, '~');
    q1.transition(q2, 'a').transition(q2, '~');
    q2.transition(q1, '~').transition(q3, '~');
    q3.transition(q4, 'b');
    q4.finalize();
  });

  it('parses a+b', function() {
    var parsed = RegexParser.parse('a+b');
    var nfa = new NFA('ab');
    var q0 = nfa.startState();
    var q1 = nfa.addState();
    var q2 = nfa.addState();
    var q3 = nfa.addState();
    var q4 = nfa.addState();

    q0.transition(q1, '~').transition(q3, '~');
    q1.transition(q2, 'a');
    q2.finalize();
    q3.transition(q4, 'b');
    q4.finalize();

    expect(parsed).toEqual(nfa);
  });

  it('parses (a+b)*', function() {
    var parsed = RegexParser.parse('(a+b)*');
    var nfa = new NFA('ab');
    var q0 = nfa.startState();
    var q1 = nfa.addState();
    var q2 = nfa.addState();
    var q3 = nfa.addState();
    var q4 = nfa.addState();
    var q5 = nfa.addState();
    var q6 = nfa.addState();

    q0.transition(q1, '~');
    q1.transition(q2, '~').transition(q4, '~').transition(q6, '~');
    q2.transition(q3, 'a');
    q3.transition(q6, '~');
    q4.transition(q5, 'b');
    q5.transition(q6, '~');
    q6.transition(q1, '~').finalize();

    expect(parsed).toEqual(nfa);
  });
});