(define (domain elevators)
  (:requirements :strips :typing)
  
  (:types
    elevator passenger num
  )
  
  (:predicates
    (passenger-at ?person - passenger ?floor - num)
    (boarded ?person - passenger ?lift - elevator)
    (lift-at ?lift - elevator ?floor - num)
    (next ?n1 - num ?n2 - num)
  )
  
  (:action move-up
    :parameters (?lift - elevator ?cur ?nxt - num)
    :precondition (and
      (lift-at ?lift ?cur)
      (next ?cur ?nxt)
    )
    :effect (and
      (not (lift-at ?lift ?cur))
      (lift-at ?lift ?nxt)
    )
  )
  
  (:action move-down
    :parameters (?lift - elevator ?cur ?nxt - num)
    :precondition (and
      (lift-at ?lift ?cur)
      (next ?nxt ?cur)
    )
    :effect (and
      (not (lift-at ?lift ?cur))
      (lift-at ?lift ?nxt)
    )
  )
  
  (:action board
    :parameters (?per - passenger ?flr - num ?lift - elevator)
    :precondition (and
      (lift-at ?lift ?flr)
      (passenger-at ?per ?flr)
    )
    :effect (and
      (not (passenger-at ?per ?flr))
      (boarded ?per ?lift)
    )
  )
  
  (:action leave
    :parameters (?per - passenger ?flr - num ?lift - elevator)
    :precondition (and
      (lift-at ?lift ?flr)
      (boarded ?per ?lift)
    )
    :effect (and
      (not (boarded ?per ?lift))
      (passenger-at ?per ?flr)
    )
  )
)
