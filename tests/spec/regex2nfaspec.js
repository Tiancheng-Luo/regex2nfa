describe('RegexParser', function() {
  describe('tokenizing regular expressions', function() {
    it('correctly tokenizes empty regex', function() {
      var tokens = RegexParser.tokenize('');
      var expected = [];
      expect(tokens).toEqual(expected);
    });

    it('correctly tokenizes abba', function() {
      var tokens = RegexParser.tokenize('abba');
      var expected = [
        { type: 'symbol', content: 'a' },
        { type: 'symbol', content: 'b' },
        { type: 'symbol', content: 'b' },
        { type: 'symbol', content: 'a' }
      ];
      expect(tokens).toEqual(expected);
    });

    it('correctly tokenizes a*b', function() {
      var tokens = RegexParser.tokenize('a*b');
      var expected = [
        { type: 'symbol', content: 'a' },
        { type: 'symbol', content: '*' },
        { type: 'symbol', content: 'b' }
      ];
      expect(tokens).toEqual(expected);
    });

    it('correctly tokenizes a+b', function() {
      var tokens = RegexParser.tokenize('a+b');
      var expected = [
        { type: 'symbol', content: 'a' },
        { type: 'symbol', content: '+' },
        { type: 'symbol', content: 'b' }
      ];
      expect(tokens).toEqual(expected);
    });

    it('correctly tokenizes (a+b)*', function() {
      var tokens = RegexParser.tokenize('(a+b)*');
      var expected = [
        { type: 'regex', content: 'a+b' },
        { type: 'symbol', content: '*' }
      ];
      expect(tokens).toEqual(expected);
    });
  });

  describe('validating regular expressions', function() {
    it('validates ababa', function() {
      expect(RegexParser.validate('ababa', 'ab')).toEqual(true);
    });

    it('validates a*b', function() {
      expect(RegexParser.validate('a*b', 'ab')).toEqual(true);
    });

    it('validates a+b', function() {
      expect(RegexParser.validate('a+b', 'ab')).toEqual(true);
    });

    it('validates (aba+ba)*', function() {
      expect(RegexParser.validate('(aba+ba)*', 'ab')).toEqual(true);
    });

    it('validates a***b', function() {
      expect(RegexParser.validate('a***b', 'ab')).toEqual(true);
    });

    it('validates *a', function() {
      expect(RegexParser.validate('*a', 'ab')).toEqual(true);
    });

    it('invalidates +', function() {
      expect(RegexParser.validate('+', 'ab')).toEqual(false);
    });

    it('invalidates a+', function() {
      expect(RegexParser.validate('a+', 'ab')).toEqual(false);
    });

    it('invalidates +a', function() {
      expect(RegexParser.validate('+a', 'ab')).toEqual(false);
    });

    it('invalidates a++b', function() {
      expect(RegexParser.validate('a++b', 'ab')).toEqual(false);
    });

    it('invalidates (ab', function() {
      expect(RegexParser.validate('(ab', 'ab')).toEqual(false);
    });

    it('invalidates ab)', function() {
      expect(RegexParser.validate('ab)', 'ab')).toEqual(false);
    });
  });

  describe('cleaning regular expressions', function() {
    it('correctly cleans abba', function() {
      expect(RegexParser.clean('abba')).toEqual('abba');
    });

    it('correctly cleans ab*ba', function() {
      expect(RegexParser.clean('ab*ba')).toEqual('ab*ba');
    });

    it('correctly cleans ab**ba', function() {
      expect(RegexParser.clean('ab**ba')).toEqual('ab*ba');
    });

    it('correctly cleans ab*****ba', function() {
      expect(RegexParser.clean('ab*****ba')).toEqual('ab*ba');
    });

    it('correctly cleans *a', function() {
      expect(RegexParser.clean('*a')).toEqual('a');
    });

    it('correctly cleans ***a', function() {
      expect(RegexParser.clean('***a')).toEqual('a');
    });
  });

  describe('parsing regular expressions to NFA', function() {
    it('correctly parses empty regex', function() {
      var parsed = RegexParser.parse('');
      var nfa = new NFA('ab');
      nfa.getStartState().finalize();

      expect(parsed).toEqual(nfa);
    });

    it('correctly parses abba', function() {
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

    it('correctly parses a*b', function() {
      var parsed = RegexParser.parse('a*b');
      var nfa = new NFA('ab');
      var q0 = nfa.getStartState();
      var q1 = nfa.addState();
      var q2 = nfa.addState();
      var q3 = nfa.addState();
      var q4 = nfa.addState();

      q0.transition(q1, '~').transition(q3, '~');
      q1.transition(q2, 'a');
      q2.transition(q0, '~').transition(q3, '~');
      q3.transition(q4, 'b');
      q4.finalize();

      expect(parsed).toEqual(nfa);
    });

    it('correctly parses a+b', function() {
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

    it('correctly parses (a+b)*', function() {
      var parsed = RegexParser.parse('(a+b)*');
      var nfa = new NFA('ab');
      var q0 = nfa.getStartState();
      var q1 = nfa.addState();
      var q2 = nfa.addState();
      var q3 = nfa.addState();
      var q4 = nfa.addState();
      var q5 = nfa.addState();

      q0.transition(q1, '~').finalize();
      q1.transition(q2, '~').transition(q4, '~');
      q2.transition(q3, 'a');
      q3.transition(q0, '~').finalize();
      q4.transition(q5, 'b');
      q5.transition(q0, '~').finalize();

      expect(parsed).toEqual(nfa);
    });
  });  
});