import { processSteps } from '../../data/process';
import { Reveal } from '../animations/Reveal';

export function ProcessTimeline() {
  return (
    <Reveal as="ol" className="process">
      {processSteps.map((step) => (
        <li key={step.n} className="process__step">
          <span className="process__num" aria-hidden="true">
            {step.n}
          </span>
          <h3>
            <span className="visually-hidden">Step {step.n}: </span>
            {step.title}
          </h3>
          <p>{step.text}</p>
        </li>
      ))}
    </Reveal>
  );
}
