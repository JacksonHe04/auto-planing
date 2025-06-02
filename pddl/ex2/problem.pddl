(define (problem elevator-problem)
  (:domain elevator)
  
  (:objects
    elevator1 elevator2 - elevator
    floor1 floor2 floor3 floor4 floor5 - floor
  )
  
  (:init
    ; 初始状态：两部电梯都在1楼
    (at elevator1 floor1)
    (at elevator2 floor1)
    
    ; 假设所有楼层都有请求
    (requested floor1)
    (requested floor2)
    (requested floor3)
    (requested floor4)
    (requested floor5)
  )
  
  (:goal
    (and
      ; 所有楼层都被服务
      (served floor1)
      (served floor2)
      (served floor3)
      (served floor4)
      (served floor5)
      ; 最终状态：电梯1在1楼，电梯2在5楼
      (at elevator1 floor1)
      (at elevator2 floor5)
    )
  )
)
