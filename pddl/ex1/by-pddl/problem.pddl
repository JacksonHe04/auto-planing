(define (problem parking-rearrangement-problem)
  (:domain parking-rearrangement)
  
  (:objects
    lane1 lane2 - lane
    space1 space2 space3 - space
    car1 car2 car3 car4 car5 - car
  )
  
  (:init
    ; 定义空间关系
    (right-of space2 space1)
    (right-of space3 space2)
    
    ; 初始状态
    (at car1 lane1 space1)
    (at car2 lane1 space2)
    (at car3 lane1 space3)
    (at car4 lane2 space1)
    (at car5 lane2 space2)
    (empty lane2 space3)
  )
  
  (:goal
    (and
      (at car3 lane1 space1)
      (at car4 lane1 space2)
      (at car5 lane1 space3)
      (at car1 lane2 space1)
      (at car2 lane2 space2)
      (empty lane2 space3)
    )
  )
)
