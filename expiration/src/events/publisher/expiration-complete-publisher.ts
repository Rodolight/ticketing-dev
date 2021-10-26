import {
  Subjects,
  Publisher,
  ExpirationCompleteEvent
} from '@rdpticketsv/common';

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
 readonly subject = Subjects.ExpirationComplete;

}