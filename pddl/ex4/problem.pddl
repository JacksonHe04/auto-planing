(define (problem elevator-problem)
  (:domain elevators)
  
  (:objects
    e1 - elevator
    p1 p2 - passenger
    n1 n2 n3 - num
  )
  
  (:init
    ; 定义楼层相邻关系
    (next n1 n2)
    (next n2 n3)
    
    ; 初始位置
    (lift-at e1 n1)
    (passenger-at p1 n1)
    (passenger-at p2 n3)
  )
  
  (:goal
    (and
      (passenger-at p1 n3)
      (passenger-at p2 n1)
    )
  )
)
