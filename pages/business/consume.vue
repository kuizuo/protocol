<script lang="ts" setup>
import type { DataTableColumns, DataTableRowKey, FormInst } from 'naive-ui'
import type { RowData } from 'naive-ui/es/data-table/src/interface'
import CatalogIcon from '~icons/carbon/catalog'

definePageMeta({
  middleware: ['auth'],
  layout: 'dashboard',
  title: '库存流水记录',
  icon: CatalogIcon,
  order: 6,
})

const { data, refresh } = await useAsyncData('consume', async () => {
  const response = await request<API.Result>('/api/inventoryLog/list')
  return response.data.map((d: any) => {
    return {
      name: d.medicineList.map((m: any) => m.name).join('、'),
      count: d.quantitySold.join('、'),
      actualPayments: d.actualPayments,
      sellingDatetime: d.sellingDatetime,
      note: d.note,
    }
  })
})

const columns: DataTableColumns<API.Medicine> = [
  {
    type: 'selection',
    fixed: 'left',
  },
  {
    title: '药品',
    key: 'name',
  },
  {
    title: '数量',
    key: 'count',
  },
  {
    title: '盈亏额',
    key: 'actualPayments',
  },
  {
    title: '账单时间',
    key: 'sellingDatetime',
  },
  {
    title: '备注',
    key: 'note',
  },

]

const rowKey = (row: RowData) => row.no
const checkedRowKeys = ref<DataTableRowKey[]>([])
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
})

function handleCheck(rowKeys: DataTableRowKey[]) {
  checkedRowKeys.value = rowKeys
}
</script>

<template>
  <PageWrapper>
    <PageHeader />
    <PageBody>
      <NRow :gutter="12">
        <NCol :span="12">
          <NSpace justify="start" mb-2>
            <!-- 刷新 -->
            <NTooltip trigger="hover">
              <template #trigger>
                <div @click="refresh()">
                  <NIcon size="18">
                    <i i-carbon-restart text-gray-8 inline-block cursor-pointer select-none opacity-75 transition hover:opacity-100 hover:text-blue-600 />
                  </NIcon>
                </div>
              </template>
              <span>刷新</span>
            </NTooltip>
          </NSpace>
        </NCol>
      </NRow>
      <NDataTable
        :columns="columns"
        :data="data"
        :row-key="rowKey"
        :pagination="pagination"
        @update:checked-row-keys="handleCheck"
      />
    </PageBody>
  </PageWrapper>
</template>
