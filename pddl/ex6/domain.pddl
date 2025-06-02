(define (domain parking-rearrangement)
  (:requirements :strips :typing)
  
  (:types
    lane space car
  )
  
  (:predicates
    (at ?c - car ?l - lane ?s - space)  ; 车辆c在车道l的s位置
    (empty ?l - lane ?s - space)        ; 车道l的s位置是空的
    (right-of ?s1 ?s2 - space)          ; s1在s2的右边
  )
  
  (:action move-right
    :parameters (?c - car ?l - lane ?s1 ?s2 - space)
    :precondition (and
      (at ?c ?l ?s1)
      (empty ?l ?s2)
      (right-of ?s2 ?s1)
    )
    :effect (and
      (not (at ?c ?l ?s1))
      (not (empty ?l ?s2))
      (at ?c ?l ?s2)
      (empty ?l ?s1)
    )
  )

  (:action move-left
    :parameters (?c - car ?l - lane ?s1 ?s2 - space)
    :precondition (and
      (at ?c ?l ?s1)
      (empty ?l ?s2)
      (right-of ?s1 ?s2)
    )
    :effect (and
      (not (at ?c ?l ?s1))
      (not (empty ?l ?s2))
      (at ?c ?l ?s2)
      (empty ?l ?s1)
    )
  )

  (:action move-to-other-lane
    :parameters (?c - car ?l1 ?l2 - lane ?s1 ?s2 - space)
    :precondition (and
      (at ?c ?l1 ?s1)
      (empty ?l2 ?s2)
      (not (= ?l1 ?l2))
    )
    :effect (and
      (not (at ?c ?l1 ?s1))
      (not (empty ?l2 ?s2))
      (at ?c ?l2 ?s2)
      (empty ?l1 ?s1)
    )
  )
)