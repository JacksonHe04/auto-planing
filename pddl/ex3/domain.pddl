; domain.pddl
(define (domain racetrack)
  (:predicates
    (at ?x ?y) ; Car is at coordinates (x, y)
    (vx ?v)    ; Car has x velocity v
    (vy ?v)    ; Car has y velocity v
    (obstacle ?x ?y) ; There is an obstacle at (x, y)
    (goal ?x ?y)     ; Goal region includes (x, y)
    (next-v ?v1 ?v2) ; v2 is the next velocity after v1
  )

  (:action adjust-vx
    :parameters (?current-vx ?new-vx)
    :precondition (and (vx ?current-vx)
                       (next-v ?current-vx ?new-vx))
    :effect (and (not (vx ?current-vx)) (vx ?new-vx))
  )

  (:action adjust-vy
    :parameters (?current-vy ?new-vy)
    :precondition (and (vy ?current-vy)
                       (next-v ?current-vy ?new-vy))
    :effect (and (not (vy ?current-vy)) (vy ?new-vy))
  )

  (:action move
    :parameters (?start-x ?start-y ?vx ?vy ?end-x ?end-y)
    :precondition (and (at ?start-x ?start-y)
                       (vx ?vx)
                       (vy ?vy)
                       (not (obstacle ?end-x ?end-y)))
    :effect (and (not (at ?start-x ?start-y))
                 (at ?end-x ?end-y))
  )
)