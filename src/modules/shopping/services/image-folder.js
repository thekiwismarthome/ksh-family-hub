// Where pictures matched by product name are looked for. The integration copies the older folders' pictures into it.
export const DEFAULT_IMAGE_FOLDER = '/local/images/ksh-family-hub/shopping';

// Earlier standard folders. A folder somebody chose themselves is left alone.
const OLD_FOLDERS = ['/local/images/groceries', '/local/images/shopping_list_manager'];

/**
 * Settings saved by an earlier version that name an old standard folder now name the new one. Done once: the settings are
 * marked, so somebody who afterwards types an old folder on purpose keeps it. Give it what was saved, not the defaults.
 */
export function moveImageFolder(saved) {
  if (!saved || saved.imageFolderMoved) return saved;
  const path = (saved.localImagePath || '').replace(/\/+$/, '');
  return { ...saved, ...(OLD_FOLDERS.includes(path) ? { localImagePath: DEFAULT_IMAGE_FOLDER } : {}), imageFolderMoved: true };
}
