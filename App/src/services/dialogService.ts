import Vue from 'vue';
import Modal from '@/components/Modal.vue';
import Snackbar from '@/components/Snackbar.vue';
import type {DialogLevel, Position} from '@/enums';
import vuetify from '@/plugins/vuetify';

export class DialogService {
  public toast(text: string, level?: DialogLevel, title?: string, timeout?: number, closable?: boolean, position?: Position): void {
    const toastId: string = 'dialog.toast';

    const oldElement: HTMLElement | null = document.getElementById(toastId);

    if (oldElement) {
      oldElement.remove();
    }

    const element: Element = new Vue({
      vuetify: vuetify,
      render: (r) => r(Snackbar, {
        props: {
          title: title,
          text: text,
          level: level,
          timeout: timeout,
          closable: closable,
          position: position,
        },
      }),
    })
        .$mount()
        .$el;

    element.id = toastId;

    const app: HTMLElement | null = document.getElementById('app');

    if (app) {
      app.appendChild(element);
    }
  }

  public prompt(title: string, text: string, confirmText?: string): Promise<void> {
    const vm = new Vue({
      vuetify: vuetify,
      render: (r) => r(Modal, {
        props: {
          title: title,
          text: text,
          confirmText: confirmText || 'Ok',
        },
      }),
    })
        .$mount();

    return new Promise((resolve) => {
      vm.$on('dialog', () => {
        resolve();
      });
    });
  }

  public confirm(title: string, text: string, confirmText?: string, cancelText?: string): Promise<boolean> {
    const vm = new Vue({
      vuetify: vuetify,
      render: (r) => r(Modal, {
        props: {
          title: title,
          text: text,
          confirmText: confirmText || 'Ok',
          cancelText: cancelText || 'Annuler',
        },
      }),
    })
        .$mount();

    return new Promise<boolean>((resolve) => {
      vm.$on('dialog', (value: boolean) => {
        resolve(value);
      });
    });
  }
}
