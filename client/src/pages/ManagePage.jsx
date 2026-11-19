import { useState } from 'react'
import { deleteWorkspace, getAdminToken, getAllWorkspaces, setAdminToken } from '../api/api.js'
import Button from '../components/Button.jsx'
import FormField from '../components/FormField.jsx'
import Modal from '../components/Modal.jsx'
import StateMessage from '../components/StateMessage.jsx'
import WorkspaceForm from '../components/WorkspaceForm.jsx'
import { useFetch } from '../hooks/useFetch.js'
import { useSeo } from '../hooks/useSeo.js'
import { TYPE_LABELS } from '../utils/format.js'

/**
 * ManagePage — керування місцями через API (CRUD з інтерфейсу):
 *   • додавання (POST /api/items) — WorkspaceForm;
 *   • видалення (DELETE /api/items/:id) — кнопка в таблиці + підтвердження в модальному вікні.
 * Якщо на сервері задано ADMIN_TOKEN, для змін потрібен токен адміністратора (поле нижче; зберігається лише в sessionStorage).
 * Повноцінної авторизації (акаунти, сесії) в навчальному проєкті немає.
 */
export default function ManagePage() {
  // Службова сторінка без авторизації — не повинна потрапляти в пошукову видачу (noindex)
  useSeo({ title: 'Керування місцями', description: 'Додавання й видалення робочих місць коворкінгу через API.', noindex: true })
  const { data, loading, error, refetch } = useFetch(getAllWorkspaces)
  const [notice, setNotice] = useState(null) // { type: 'success' | 'error', text }
  const [toDelete, setToDelete] = useState(null) // місце, видалення якого підтверджується
  const [deleting, setDeleting] = useState(false)
  const [adminToken, setAdminTokenState] = useState(getAdminToken)

  function handleTokenChange(event) {
    setAdminTokenState(event.target.value)
    setAdminToken(event.target.value)
  }

  function handleCreated(created) {
    setNotice({ type: 'success', text: `Місце «${created.name}» додано (id ${created.id}).` })
    refetch()
  }

  async function handleConfirmDelete() {
    setDeleting(true)
    try {
      await deleteWorkspace(toDelete.id)
      setNotice({ type: 'success', text: `Місце «${toDelete.name}» видалено.` })
      refetch()
    } catch (err) {
      // 409: на місце є майбутні бронювання; 404: уже видалено; NETWORK: сервер недоступний
      setNotice({ type: 'error', text: err.message })
      if (err.code === 'NOT_FOUND') refetch()
    } finally {
      setDeleting(false)
      setToDelete(null)
    }
  }

  return (
    <main id="main-content" tabIndex={-1} className="container">
      <h1>Керування місцями</h1>
      <p>Додавайте й видаляйте робочі місця. Дані зберігаються на сервері (REST API).</p>

      {notice && (
        <StateMessage variant={notice.type}>
          <p>{notice.text}</p>
        </StateMessage>
      )}

      <section aria-labelledby="access-title">
        <h2 id="access-title">Доступ адміністратора</h2>
        <p>Якщо на сервері задано токен, введіть його, щоб додавати й видаляти місця. Токен зберігається лише до закриття вкладки.</p>
        <FormField
          label="Токен адміністратора"
          name="adminToken"
          type="password"
          autoComplete="off"
          value={adminToken}
          onChange={handleTokenChange}
        />
      </section>

      <section aria-labelledby="add-title">
        <h2 id="add-title">Додати місце</h2>
        <WorkspaceForm onCreated={handleCreated} />
      </section>

      <section aria-labelledby="all-title">
        <h2 id="all-title">Усі місця</h2>

        {loading && data === null && (
          <StateMessage variant="loading">
            <p>Завантажуємо список…</p>
          </StateMessage>
        )}

        {error && (
          <StateMessage variant="error" title="Не вдалося завантажити список.">
            <p>{error.message}</p>
            <p>
              <Button onClick={refetch}>Спробувати ще раз</Button>
            </p>
          </StateMessage>
        )}

        {data && data.length === 0 && <StateMessage title="Місць поки немає." />}

        {data && data.length > 0 && (
          <div className="table-wrap" role="region" aria-labelledby="all-title" tabIndex={0}>
            <table>
              <caption>Усього місць: {data.length}</caption>
              <thead>
                <tr>
                  <th scope="col">Назва</th>
                  <th scope="col">Тип</th>
                  <th scope="col">Ціна/год</th>
                  <th scope="col">Місць</th>
                  <th scope="col">Дії</th>
                </tr>
              </thead>
              <tbody>
                {data.map((workspace) => (
                  <tr key={workspace.id}>
                    <th scope="row">
                      {workspace.name}
                      {!workspace.isActive && <span className="badge">прихована</span>}
                    </th>
                    <td>{TYPE_LABELS[workspace.type] ?? workspace.type}</td>
                    <td>{workspace.pricePerHour} грн</td>
                    <td>{workspace.capacity}</td>
                    <td className="table-actions">
                      <Button
                        variant="danger"
                        size="small"
                        aria-label={`Видалити місце ${workspace.name}`}
                        onClick={() => setToDelete(workspace)}
                      >
                        Видалити
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <Modal
        open={toDelete !== null}
        onClose={() => setToDelete(null)}
        title="Видалити місце?"
        actions={
          <div className="modal-actions">
            <Button variant="danger" onClick={handleConfirmDelete} disabled={deleting}>
              Так, видалити
            </Button>
            <Button variant="secondary" onClick={() => setToDelete(null)} autoFocus>
              Скасувати
            </Button>
          </div>
        }
      >
        {toDelete && <p>Місце «{toDelete.name}» буде видалено. Цю дію не можна скасувати.</p>}
      </Modal>
    </main>
  )
}
