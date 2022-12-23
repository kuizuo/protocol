import { ComputedRef, Ref } from 'vue'
declare module "vue-router" {
  interface RouteMeta {
    title: string
    icon: any
    order: number
  }
}