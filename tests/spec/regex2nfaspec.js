describe('RegexParser', function() {
  it('parses empty regex', function() {
    var parsed = RegexParser.parse('');
    var nfa = new NFA('ab');
    nfa.startState().finalize();

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