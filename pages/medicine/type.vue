<script lang="ts" setup>
import { NButton, useMessage } from 'naive-ui'
import type { DataTableColumns, DataTableRowKey, FormInst } from 'naive-ui'
import type { RowData } from 'naive-ui/es/data-table/src/interface'
import TypeIcon from '~icons/carbon/type-pattern'

definePageMeta({
  layout: 'dashboard',
  title: '药品类型',
  icon: TypeIcon,
  order: 5,
})

const { data, refresh } = await useAsyncData('medicine-type', async () => {
  const response = await request<API.Result>('/api/medicine/type/list')
  return response.data
})

const columns: DataTableColumns<API.Medicine> = [
  {
    type: 'selection',
    fixed: 'left',
  },
  {
    title: '药品类型',
    key: 'name',
  },
  {
    width: 140,
    title: '操作',
    key: 'action',
    fixed: 'right',
    render(row) {
      return [
        h(
          NButton,
          {
            style: {
              marginRight: '6px',
            },
            size: 'small',
            type: 'warning',
            onClick: () => handleEdit(row),
          },
          { default: () => '编辑' },
        ),
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
let isEdit = $ref(false)

const formRef = $ref<FormInst | null>()
const form = reactive({
  id: -1,
  name: '',
})
const rowKey = (row: RowData) => row.no
const checkedRowKeys = ref<DataTableRowKey[]>([])
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
})
let formBtnLoading = $ref(false)

const handleAdd = () => {
  title = '添加'
  showModal = true
  isEdit = false
  form.id = -1
  form.name = ''
}

async function handleEdit(record: API.Medicine) {
  title = '编辑'
  showModal = true
  isEdit = true
  form.id = record.id
  form.name = record.name
}

async function handleDelete(record: API.Medicine) {
  try {
    await request(`/api/medicine/type/remove?id=${record.id}`, {
      method: 'POST',
    })

    message.success('删除成功')
    refresh()
  }
  catch (error) {
    message.error((error as Error).message)
  }
}

async function confirmForm(e: Event) {
  e.preventDefault()
  formBtnLoading = true

  try {
    const url = isEdit ? '/api/medicine/type/update' : '/api/medicine/type/add'
    await request(url, {
      method: 'POST',
      body: form,
    })
    message.success('操作成功')
    showModal = false

    refresh()
  }
  catch (error) {
    message.error((error as Error).message)
  }
  finally {
    formBtnLoading = false
  }
}

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
        <NCol :span="12">
          <NSpace justify="end" align="center" mb-2>
            <NButton type="info" @click="handleAdd">
              添加
            </NButton>
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
      <NModal v-model:show="showModal" :show-icon="false" preset="dialog" :title="title">
        <NForm
          ref="formRef"
          :model="form"
          label-placement="left"
          :label-width="80"
          class="py-4"
        >
          <NFormItem label="药品类型">
            <NInput
              v-model:value="form.name"
              placeholder="请输入药品类型"
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
