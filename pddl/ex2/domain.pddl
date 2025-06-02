(define (domain elevator)
  (:requirements :strips :typing)
  
  (:types
    elevator floor
  )
  
  (:predicates
    (at ?e - elevator ?f - floor)  ; 电梯e在楼层f
    (requested ?f - floor)         ; 楼层f有请求
    (served ?f - floor)            ; 楼层f已被服务
  )
  
  (:action move-up
    :parameters (?e - elevator ?f1 - floor ?f2 - floor)
    :precondition (and (at ?e ?f1) (not (at ?e ?f2)))
    :effect (and (at ?e ?f2) (not (at ?e ?f1)))
  )
  
  (:action move-down
    :parameters (?e - elevator ?f1 - floor ?f2 - floor)
    :precondition (and (at ?e ?f1) (not (at ?e ?f2)))
    :effect (and (at ?e ?f2) (not (at ?e ?f1)))
  )
  
  (:action serve
    :parameters (?e - elevator ?f - floor)
    :precondition (and (at ?e ?f) (requested ?f) (not (served ?f)))
    :effect (and (served ?f) (not (requested ?f)))
  )
)
