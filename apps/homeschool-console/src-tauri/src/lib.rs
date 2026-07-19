use std::sync::atomic::{AtomicBool, Ordering};
use tauri::{Emitter, Manager, WindowEvent};

struct ExitGate(AtomicBool);

#[tauri::command]
fn allow_guardian_exit(exit_gate: tauri::State<'_, ExitGate>) {
  exit_gate.0.store(true, Ordering::SeqCst);
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder::default()
    .manage(ExitGate(AtomicBool::new(false)))
    .invoke_handler(tauri::generate_handler![allow_guardian_exit])
    .setup(|app| {
      if cfg!(debug_assertions) {
        app.handle().plugin(
          tauri_plugin_log::Builder::default()
            .level(log::LevelFilter::Info)
            .build(),
        )?;
      }
      Ok(())
    })
    .on_window_event(|window, event| {
      if let WindowEvent::CloseRequested { api, .. } = event {
        let exit_gate = window.state::<ExitGate>();
        if !exit_gate.0.swap(false, Ordering::SeqCst) {
          api.prevent_close();
          let _ = window.emit("learnos://exit-requested", ());
        }
      }
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
