describe('RegexParser', function() {
  it('parses empty regex', function() {
    var parsed = RegexParser.parse('');
    var nfa = new NFA('ab');
    nfa.getStartState().finalize();

    expect(parsed).toEqual(nfa);
  });

  it('parses abba', function() {
    var parsed = RegexParser.parse('abba');
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
    q2.transition(q3, 'b');
    q3.transition(q4, '~');
    q4.transition(q5, 'b');
    q5.transition(q6, '~');
    q6.transition(q7, 'a');
    q7.finalize();

    expect(parsed).toEqual(nfa);
  });

  it('parses a*b', function() {
    var parsed = RegexParser.parse('a*b');
    var nfa = new NFA('ab');
    var q0 = nfa.getStartState();
    var q1 = nfa.addState();
    var q2 = nfa.addState();
    var q3 = nfa.addState();

    q0.transition(q1, 'a').transition(q2, '~');
    q1.transition(q0, '~').transition(q2, '~');
    q2.transition(q3, 'b');
    q3.finalize();

    expect(parsed).toEqual(nfa);
  });

  it('parses a+b', function() {
    var parsed = RegexParser.parse('a+b');
    var nfa = new NFA('ab');
    var q0 = nfa.getStartState();
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
    var q0 = nfa.getStartState();
    var q1 = nfa.addState();
    var q2 = nfa.addState();
    var q3 = nfa.addState();
    var q4 = nfa.addState();

    q0.transition(q1, '~').transition(q3, '~').finalize();
    q1.transition(q2, 'a');
    q2.transition(q0, '~').finalize();
    q3.transition(q4, 'b');
    q4.transition(q0, '~').finalize();

    expect(parsed).toEqual(nfa);
  });
});