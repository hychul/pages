| Name | Description |
|-|-|
| @PrePersist | Executed before the entity manager persist operation is actually executed or cascaded. This call is synchronous with the persist operation. |
| @PreRemove | Executed before the entity manager remove operation is actually executed or cascaded. This call is synchronous with the remove operation. |
| @PostPersist | Executed after the entity manager persist operation is actually executed or cascaded. This call is invoked after the database INSERT is executed. |
| @PostRemove | 	Executed after the entity manager remove operation is actually executed or cascaded. This call is synchronous with the remove operation. |
| @PreUpdate | Executed before the database UPDATE operation. |
| @PostUpdate | Executed after the database UPDATE operation. |
| @PostLoad| Executed after an entity has been loaded into the current persistence context or an entity has been refreshed. |

https://singun.github.io/2017/01/25/why-does-not-work-preupdate-annotation/