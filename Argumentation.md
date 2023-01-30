# Argumentation types

## Deductive Reasoning
Deductive reasoning, also deductive logic, is the process of reasoning from one or more statements to reach a logical conclusion. Deductive reasoning goes in the same direction as that of the conditionals, and links premises with conclusions.

### Syllogism
A syllogism is a kind of logical argument that applies deductive reasoning to arrive at a conclusion based on two propositions that are asserted or assumed to be true. 

## Inductive Reasoning
Inductive reasoning is a method of reasoning in which a body of observations is synthesized to come up with a general principle. Inductive reasoning is distinct from deductive reasoning.

## Abductive Reasoning
Abductive reasoning allows inferring {\displaystyle a}a as an explanation of {\displaystyle b}b. As a result of this inference, abduction allows the precondition {\displaystyle a}a to be abducted from the consequence {\displaystyle b}b. Deductive reasoning and abductive reasoning thus differ in which end, left or right, of the proposition "{\displaystyle a}a entails {\displaystyle b}b" serves as conclusion.

## Synonyms

* Assertion, Contention, Claim, Conclusion
* Statement, Comment, Observation
* Axiom, Postulate, Assumption - statement that is taken to be true, to serve as a premise or starting point for further reasoning.

## Possible categories

Scientific Method Part 1 - Inductive
* Question
* Background research
* Testable hypothesis

Scientific Method Part 2 - Deductive
* Hypothesis
* Tests
* Conclusion

Abductive Reasoning - more creative process
* A set of observations.
* A prediction of the most likely conclusion.

Inference
* Supporting evidence
* Conclusion

Causal Inference
* Comparison of potential outcomes

Statistical Inference
* Applying statisical methods to a data set to determine probable outcomes.

Observation
* Statement about something you've experienced yourself, i.e. seen, heard, touched, smelled.

Prediction
* Statement about something that might happen in the future.

Bayesian probability
* A quantification of personal belief in which statisical methods are used to determine a probable outcome based on a current state of knowledge. Then updating when new data comes in.

Scientific Hypothesis
* A testable proposition or explanation for a phenomenon, usually based on prior observations.

Claims
* Fact claim: is about a measurable topic
* Value claim: about a moral, aesthetic, or philisophical topic
* Policy claim: an assertion about a course of action that should be taken.


## Card Types

### Question 
Icon: question mark
1. The question
2. Background context
3. Possible answer(s)

### Claim
Icon: bullhorn
1. A Policy, value or factual claim.
2. Supporting reasoning (Inductive, Deductive, Abductive)
3. Conclusion, restate or summarize claim

### Idea
Icon: light bulb
1. What is the problem you are trying to solve?
2. What is your proposed solution?
3. Why? How is X better than Y? Or, how will it improve people's lives?

### Source
Icon: c or i 
1. 
2. 
3.

## Card Type Examples ?

### Inductive Reasoning
* Observations
* Analysis
* Theory: Conclusion is a generalization

### Deductive Reasoning
* Claim or idea
* Observation
* Conclusion

### Abductive Reasoning
* Observations
* A prediction of the most likely conclusion.

### Factual Claim
* Propositional logic, i.e. premises with logical connectives such as "and", "or", "not", "if"
* Claim of fact: Therefore X is true.

### Value Claim
* moral, aesthetic, or philosophical premises
* Claim of value: Therefore X is wrong.

### Policy Claim
* Observations
* Claim of policy: Therefore we should do X (rather than Y).

## Resources

* Argument Map: https://en.wikipedia.org/wiki/Argument_map
* Decision Theory: https://en.wikipedia.org/wiki/Decision_theory
* https://en.wikipedia.org/wiki/Propositional_calculus
* https://en.wikipedia.org/wiki/Decision_support_system

## Questions

What am I building?
* A Decision Support System (DSS)?
* A Critical Thinking teaching tool?
* Collective intelligence?

Does the content need to be machine readable?
Do the constraints need to enforce machine readable propositions?

## Theory

We start out with beliefs which are subjective inferences.  

Over the course of our lives we accumulate experience which re-inforces some of these inferences and 

## What sort of specializations do you need?

* Game theory, economic decision making theory
* Behavioral psychologist
* Computational linguist?

## Entity Relationships

Attempt to map my evolving understanding of entities and relationships in a knowledge graph to those used for Symthink.  

The parent entity of an entity (question, claim or idea) provides additional contextual meaning to the entity.  9 permutations:

### Question --> Claims

### Question --> Ideas

### Question --> Questions

### Claim --> Questions
### Claim --> Ideas
### Claim --> Claims

### Ideas --> Questions
### Ideas --> Claims
### Ideas --> Ideas

## Decision Types

* Develop a list of things of a type
    - type: Culling
    - behavior: 
        - After X supports added, reduce to Y
        - ? Specify X when adding the question.
        - Can add more supports if you can reduce below X.

* List of ways to re/phrase something
    - type: Cull & Replace: Culling down to one which would replace the parent

* Choose the best option
    - type: Multiple Choice

* Which is better
    - type: Binary Choice

When you create a question, you may also add constraints for the supports.
    - target: 1
    - replace: true/false (only applies if target===1)
    - type: Ideas only
    - limit: 8
    - priortized: true/false 
    - bydate: Jan. 1 2024
