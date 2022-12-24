<script lang="ts" setup>
import type { DataTableColumns, DataTableRowKey, FormInst } from 'naive-ui'
import { NButton, NDataTable, NDropdown, NForm, NFormItem, NInputNumber, NModal, NSpace, NTag, useMessage } from 'naive-ui'
import type { RowData } from 'naive-ui/es/data-table/src/interface'
import ListIcon from '~icons/carbon/list'

const route = useRoute()

definePageMeta({
  layout: 'dashboard',
  title: '药品库存列表',
  icon: ListIcon,
  order: 4,
})
// import { columns } from './data'

const response = await request<API.Result>('/api/medicine/page', {
  method: 'GET',
  params: {
    page: 1,
    pageSize: 10,
  },
})

response.data

const { copy, copied } = useClipboard()

const columns: DataTableColumns<API.Medicine> = [
  {
    type: 'selection',
    fixed: 'left',
  },
  {
    title: '是否使用',
    key: 'used',
    filterOptions: [
      {
        label: '已使用',
        value: 1,
      },
      {
        label: '未使用',
        value: 0,
      },
    ],
    filter(value, row) {
      return row.used === !!value
    },
    render(row) {
      const type = row.used ? 'error' : 'success'
      const message = row.used ? '已使用' : '未使用'
      return h(
        NTag,
        {
          style: {
            marginRight: '6px',
          },
          type,
          bordered: false,
        },
        {
          default: () => message,
        },
      )
    },
  },
  {
    title: '使用时间',
    key: 'usedTime',
    sorter: true,
    render(row, index) {
      if (row.usedTime) {
        const format = useDateFormat(row.usedTime ?? '', 'YYYY-MM-DD HH:mm:ss')
        return h('span', ['', format.value])
      }
      return ''
    },
  },
  {
    width: 140,
    title: '操作',
    key: 'action',
    fixed: 'right',
    render(row) {
      return [
        // h(
        //   NButton,
        //   {
        //     style: {
        //       marginRight: '6px',
        //     },
        //     size: 'small',
        //     type: 'warning',
        //     onClick: () => handleEdit(row),
        //   },
        //   { default: () => '编辑' },
        // ),
        h(
          NButton,
          {
            style: {
              marginRight: '6px',
            },
            size: 'small',
            type: 'error',
            onClick: () => handleDelete(row),
          },
          { default: () => '删除' },
        )]
    },
  },
]

const message = useMessage()
let showModal = $ref(false)
let title = $ref('')

const handleAdd = () => {
  title = '添加卡密'
  showModal = true
}

async function handleEdit(record: API.Medicine) {
  title = '编辑卡密'
  showModal = true
}

async function handleDelete(record: API.Medicine) {
  const response = await request(`/api/ticket/${record.no}`, { method: 'DELETE' })

  message.success('删除成功')
  refresh()
}

const formRef = $ref<FormInst | null>()
const form = reactive({
  count: 5,
})
const rowKey = (row: RowData) => row.no
const checkedRowKeys = ref<DataTableRowKey[]>([])
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
})
let formBtnLoading = $ref(false)

async function confirmForm(e: Event) {
  e.preventDefault()
  formBtnLoading = true

  const response = await request('/api/ticket', {
    method: 'POST',
    body: {
      count: form.count,
    },
  })

  message.success('创建成功')

  formBtnLoading = false
  showModal = false
  refresh()
}

function handleCheck(rowKeys: DataTableRowKey[]) {
  checkedRowKeys.value = rowKeys
}
</script>

<template>
  <PageWrapper>
    <PageHeader />
    <PageBody>
      <PageSection />

      <NDataTable
        :columns="columns"
        :data="data"
        :row-key="rowKey"
        :pagination="pagination"
        @update:checked-row-keys="handleCheck"
      />
      <NModal v-model:show="showModal" :show-icon="false" preset="dialog" :title="title">
        <NForm
          ref="formRef"
          :model="form"
          label-placement="left"
          :label-width="80"
          class="py-4"
        >
          <NFormItem label="卡密数量">
            <NInputNumber
              v-model:value="form.count"
              :min="1"
              :max="100"
              :step="1"
            />
          </NFormItem>
        </NForm>

        <template #action>
          <NSpace>
            <NButton @click="() => (showModal = false)">
              取消
            </NButton>
            <NButton type="info" @click="confirmForm">
              确定
            </NButton>
          </NSpace>
        </template>
      </NModal>
    </PageBody>
  </PageWrapper>
</template>
