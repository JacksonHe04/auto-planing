; problem.pddl
(define (problem racetrack-example)
  (:domain racetrack)
  (:objects
    x0 x1 x2 x3 x4 - coordinate
    y0 y1 y2 y3 y4 - coordinate
    v-1 v0 v1 - velocity
  )

  (:init
    ; Define velocity successor relationships
    (next-v v-1 v0)
    (next-v v0 v1)
    (next-v v1 v0)
    (next-v v0 v-1)

    ; Initial position and velocity
    (at x0 y0)
    (vx v0)
    (vy v0)

    ; Simple obstacle
    (obstacle x2 y2)

    ; Goal region
    (goal x4 y4)
  )

  (:goal (exists (?x ?y - coordinate)
          (and (at ?x ?y)
               (goal ?x ?y)
               (vx v0)
          )
         )
  )
)

; Helper for coordinate and velocity objects (can be generated or manually defined)
; Assuming coordinate and velocity are of integer type for now and using symbols.
; In a more complex domain, these might be integers or a specific numeric type.
; For simplicity in this example, we define objects as symbols corresponding to values.
; This requires the domain actions to work with these symbolic representations.
; The current domain relies on equality checks which work with these symbols.