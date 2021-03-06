# Redux

- Um tempo atrás a API de Contexto não era a melhor escolha para compartilhamento de estado, nesse mesmo tempo surgiu o Redux e hoje é muito relavante no mercado.

- O Context API atualmente já faz muito sentido utilizar ele realmente melhorou muito, porém em algumas situações mais complexas não é uma boa escolha utilizar o context api, pois quaisquer atualizações ele irá atualizar o component inteiro quando não é preciso ou quando for necessário buscar informações via API REST, o context api pode acabar sendo um problema de peformance.

- O Redux é uma boa escolha para gerenciamento de estado global, porém por sua complexa implementação e arquitetura surgiu outras ferramentas que realizam o mesmo objetivo de maneira menos complexa.


## Ferramentas

- Context API
- Redux - Mais utilizado no mercado
- mobX - utilizado no (flutter)
- Recoil (vale apena)
- zustand

- Se utilizarmos GraphQL juntamente com Apollo ou Relay não precisamos utilizar ferramentas de gerenciamento de estado pois essas ferramentas já fazem isso.
- Antes de utilizar uma das ferramentas acima vale apena dar uma olhada no apollo-link-state

## Arquitetura Flux

- É uma forma de organizar estados globais dentro da aplicação, estados que são compartilhados entre vários components dentro da aplicação.

- Um exemplo de como funciona a arquitetura flux, em um e-commerce

  - HTML da Listagem de produtos
    - Cada item tem um botão de adicionar ao carrinho
      - Quando clico nesse botão ele dispara uma ACTION (ADD_PRODUCT_TO_CART) passando um {object de informações} para um `Reducer`
  - Reducer "escuta" a ACTION disparada e faz as verificações necessárias...:
      - se o carrinho já possuí o produto e só precisa alterar a quantidade
      - se precisa apenas adicionar o item ao carrinho
  - A partir daí a Conexão com o Reducer envia essas alterações ocorridas para os componentes que estão ouvindo esse estado, como:
      - A própria listagem de itens
      - Um Header com o resumo do carrinho

  - Outro modelo é quando adicionamos Middlewares antes do Reducer, suponhamos que antes de adicionar um item ao carrinho precisamos verficiar via API se esse item tem estoque ou não..., para isso utilizamos o Redux Saga, ele "intercepta" a ACTION, faz chamada a API e repassa as informações ao Reducer, e com isso o Reducer terá a logica necessário para definir se dispara um erro, ou se permite adicionar o item ao carrinho.

---

## Na prática

- Podemos criar um pojeto conforme esse: [Projeto com React Typescript](https://github.com/mrcarromesa/gostack-fundamentos-reactjs)

- Com o projeto criado e configurado podemos começar a instalar as dependencias para utilizar o redux:

```shell
yarn add redux react-redux
```

e instalamos os tipos também:

```shell
yarn add @types/react-redux -D
```

- Criamos a pasta `src/store/` e colocamos tudo que está relacionado com o redux, o redux será responsável por gerenciar e armazenar o `store` ou estado global

- Criamos o arquivo `src/store/index.ts` com o conteúdo inicial:

```ts
import { createStore } from 'redux';

const store = createStore(() => []);

export default store;
```

- Por fim no arquivo `src/App.tsx` adicionamos o provider do react-redux:

```tsx
// ...
import { Provider } from 'react-redux';
import store from './store';

const App: React.FC = () => (
  <Provider store={store}>
    <h1>Hello World!</h1>
  </Provider>
);

export default App;

```

- O Redux é baseado no Context API.

- Para verificarmos o funcionamento podemos criar o component: `src/components/Catalog/index.tsx`:

```tsx
import React from 'react';
import { useStore } from 'react-redux';

// import { Container } from './styles';

const Catalog: React.FC = () => {
  const store = useStore();

  console.log(store.getState());
  return (<h1>Catalog</h1>);
};

export default Catalog;

```

- Adicionar esse component no arquivo `App.tsx`:

```tsx
import React from 'react';
import { Provider } from 'react-redux';
import store from './store';

import Catalog from '~/components/Catalog';

const App: React.FC = () => (
  <Provider store={store}>
    <Catalog />
  </Provider>
);

export default App;

```

- E ajustar o arquivo `src/store/index.ts`:

```ts
import { createStore } from 'redux';

const store = createStore(() => 'Hello Redux');

export default store;

```

- Ao executarmos a aplicação:

```shell
yarn start
```

- Será exibido `Hello Redux` no console

- Porém não é uma boa prática utilizar o `useStore`, pois ele trará todo o estado completo. Ao ines disso utilizamos o useSelector:

```ts
const store = useSelector((state) => state);
```

- A grande diferença entre o context api e o redux é a questão da 'granularidade', no caso se eu altero apenas um item do objeto, o context api irá reenderizar o component inteiro, já o redux não ele consegue identificar que apenas um determinado item foi alterado.

---

### Reducers

- Em uma aplicação eu posso ter vários estados, porém eu preciso que os estados não interfiram uns nos outros e que eu possa controla-los isoladamente, para isso utilizamos os reducers.

- Criamos a pasta `src/store/modules/` no qual será os meus estados isolados
- Criou também a pasta `src/store/modules/cart` o qual conterá os etados relacionados ao carrinho e nessa pasta crio o arquivo `reducer.ts` no minimo crio uma function que retorna um object e exporto ela como padrão:

```ts
const cart = (): [] => [];

export default cart;

```

- Adicionamos ele em `src/store/index.ts`:

```ts
import { createStore } from 'redux';
import cart from './modules/cart/reducer';

const store = createStore(() => ({ cart }));

export default store;

```

- Criamos o arquivo `store/modules/rootReducer.ts` o qual iremos exportar todos os reducers de todos os modules:

```ts
import { combineReducers } from 'redux';
import cart from './cart/reducer';

export default combineReducers({ cart });

```

- Dentro dele importo todos os reducers de todos os modules.

- E por fim dentro de `src/store/index.ts` adiciono o rootReducer.ts:

```ts
import { createStore } from 'redux';
import rootReducer from './modules/rootReducer';

const store = createStore(rootReducer);

export default store;

```

- Com o type script precisamos definir os tipos das informações dos reducers
dessa forma para cada module adicionamos o arquivo types.ts, exemplo `src/store/modules/cart/types.ts` e armazenamos todos os types desse reducer, e no reducer, exemplo `src/store/modules/cart/reducer.ts` alteramos para o seguinte:

```ts
import { Reducer } from 'react';
import { CartState } from './types';

const INITIAL_STATE: CartState = {
  items: [],
};

const cart: Reducer<CartState, unknown> = (state, action) => {
  return INITIAL_STATE;
};

export default cart;

```

---

## JSON Server

- Para conseguirmos realzar testes seria interessante termos uma api para retornar os dados, para isso iremos utilizar o recurso json-server:

```shell
yarn add json-server -D
```

- Depois só executar o comando:

```shell
yarn json-server server.json -p 3333
```

- Para criar uma API com base no arquivo `server.json` na porta 3333

- Vamos adicionar o axios também:

```shell
yarn add axios
```

- Criamos o arquivo `src/services/api.ts`

- E ajustamos o arquivo `src/components/Catalog/index.tsx` para obter os dados via api

---

### Actions

- Para atualizar o estado global da aplicação iremos criar as actions, a qual receberá algum parametro ou não e executar determinada ação, um exemplo disso está em `src/store/modules/cart/actions.ts`

- Por fim disparamos a ação utilizando o `useDispatch` do react-redux, no component `src/components/Catalog`

### Types

- Para definir o type do estado global podemos realizar um ajuste no arquivo `src/store/index.ts`:

```ts
export interface State {
  cart: CartState;
}
```

- E então em `src/components/Cart/index.tsx` podemos ajustar:

```tsx
const cart = useSelector<State>((state) => state.cart.items);
```

- Porém se deixarmos assim a const cart será do tipo unknow, para ajustar isso podemos adicionar no generics do `useSelector<State>(...)` ainda em `src/components/Cart/index.tsx` o seguinte:

```tsx
const cart = useSelector<State, CartItem[]>((state) => state.cart.items);
```

- Dessa forma a const cart será do tipo `CartItem[]`

- E por fim já estamos prontos para realizar a listagem do nosso carrinho ainda em `src/components/Cart/index.tsx`:

```tsx
<tbody>
        {cart.map((item) => (
          <tr key={item.product.id}>
            <td>{item.product.title}</td>
            <td>{item.product.price}</td>
            <td>{item.quantity}</td>
            <td>{(item.product.price * item.quantity).toFixed(2)}</td>
          </tr>
        ))}
      </tbody>
```

---

### immer

- Como o estado é "imutável", para adicionar algum item no estado global precisamos fazer algo parecido com:

```ts
return {
  ...state,
  items: [
    ...state.items,
    {
      product,
      quantity: 1,
    },
  ],
};
```

- Para evitar essa verbosidade no código podemos utilizar a dependencia do `immer`:

```shell
yarn add immer
```

- A ideia do immer é... eu irei produzir um estado com base no rascunho do estado anterior...

- Utilizamos ele da seguinte forma como exemplo em `src/store/modules/cart/reducer.ts`:

```ts
// ...
case 'ADD_PRODUCT_TO_CART': {
      const { product } = action.payload;

      return produce(state, (draft) => {
        draft.items.push({
          product,
          quantity: 1,
        });
      });
// ...
```

- finalizando podemos melhorar um pouco mais:


```ts
const cart: Reducer<CartState, Record<string, any>> = (state = INITIAL_STATE, action) => {

  return produce(state, (draft) => {
    switch (action.type) {
      case 'ADD_PRODUCT_TO_CART': {
        const { product } = action.payload;

        draft.items.push({
          product,
          quantity: 1,
        });
        break;
      }
      default: {
        return draft;
      }
    }
  });
};
```

- Quaisquer regra de negócio devem ficar em responsabilidade do reducer, as actions devem apenas disparar  a ação juntamente com o payload


---

### Debug do redux

- Para debug do redux podemos utilizar o [Redux dev tools](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd/related?hl=pt-BR)

- No projeto também é necessário instalar a extensão:

```shell
yarn add redux-devtools-extension
```

- Ajustamos o `src/store/index.ts`:

```ts
import { createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';

// ...

const store = createStore(rootReducer, composeWithDevTools());

export default store;

```


---

## Redux Saga

- O Saga server como middleware ou interceptador entre a Action e o reducer, ou seja se após receber uma action antes de ir para o reducer precisamos realziar uma requisição ajax, podemos utilizar o saga.

- Para começar instalamos a dependencia:

```shell
yarn add redux-saga
```

- No arquivo `src/store/index.ts` iniciamos a configuração do saga:

```ts
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import createSagaMiddleware from 'redux-saga';
import { CartState } from './modules/cart/types';
import rootReducer from './modules/rootReducer';

export interface State {
  cart: CartState;
}

const sagaMiddleware = createSagaMiddleware();

const middlewares = [sagaMiddleware];

const store = createStore(rootReducer, composeWithDevTools(
  applyMiddleware(...middlewares),
));

export default store;

```

- Em `src/store/modules/cart` criamos o `sagas.ts`

- Nesse arquivo iremos interceptar as actions antes de chamar o reducer, algo importante sobre esse saga é a function take...:

- os takes serve para lidarmos com promises no saga,
- Pensando que o usuário clique no botão que chama API 5 vezes o takeLatest irá descartar todas as anteriores e considera apenas a última
- takeEvery aguarda cada uma terminar para começar a outra chamada
- takeLeading ignora todas as próximas e considera apenas a primeira
- o mais utilizado é o takeLatest

- Criamos também o arquivo `src/store/modules/rootSaga.ts`:

```ts
import { all, AllEffect, ForkEffect } from 'redux-saga/effects';

import cart from './cart/sagas';

export default function* rootSaga() : Generator<AllEffect<AllEffect<ForkEffect<never>>>> {
  return yield all([
    cart,
  ]);
}

```

- E por fim no `src/store/index.ts` adicionamos o seguinte:

```ts
sagaMiddleware.run(rootSaga);
```

- O generator ... `function* Function() { yield asyncAction(...) }` é semelhante ao `async` e `await` porém no saga não podemos utilizar o `async/await` dessa forma utilizamos o `generator`, por isso esse `*` depois da palavra `function`: `function*`

---

### Tipagem no Typescript

- Uma forma interessante de criar um tipo com base do retorno de uma function é utilizar o `ReturnType<typeof A>;`:

```ts
import { addProductToCart } from './actions';

type CheckProductStockRequest = ReturnType<typeof addProductToCart>;

function checkProductStock({ payload }: CheckProductStockRequest): any {
  //
}
```

### Obtendo a quantidade do carrinho

- No arquivo `src/store/modules/cart/sagas` utilizamos o `select` do redux para obter o valor atual do estado:

```ts
function* checkProductStock({ payload }: CheckProductStockRequest): any {
  const { product } = payload;
  const currentQuantity: number = yield select((state: State) => { // <- select utilizado para obter o estado atual
    return state.cart.items.find((item) => item.product.id === product.id)?.quantity ?? 0;
  });

  console.log(currentQuantity);
}
```

---

### Actions para utilizar com o saga

- Quando utilizamos o saga para interceptar ações ele pode retornar success ou falha, nesse caso o mais apropriado é dividir as actions em 3: Request, Succes, Failure


- Dessa forma dentro de `src/store/modules/cart` ajustamos o actions, sagas e reducer

- O pulo do gato é que o `saga` irá monitorar a action `ADD_PRODUCT_TO_CART_REQUEST` e o reducer `ADD_PRODUCT_TO_CART_SUCCESS`

- Ajustamos também o component `CatalogItem`


- Por fim para realizar uma chamada api com o saga devemos utilizar dessa forma com yield dentro de uma function generator, conforme `src/store/modules/cart/sagas.ts`:

```ts
const availableStockResponse: AxiosResponse<StockResponse> = yield call(api.get, `stock/${product.id}`);
```

- Utilizamos o `call` de dentro redux saga effects.

- Agora de posse da informação podemos dispara mais uma action indicando sucesso ou falha, para isso podemos utilizar de dentro do redux sagas effects o `put`

**Todo metodo que vem do saga precisa do `yield` na frente**

- Podemos disparar as actions de dentro de `src/store/modules/cart/sagas.ts` dessa forma:

```ts
// ...
if (availableStockResponse.data.quantity > currentQuantity) {
  yield put(addProductToCartSuccess(product));
} else {
  yield put(addProductToCartFailure(product.id));
}
// ...
```

- Note porém que no `src/store/modules/cart/reducer.ts` não estamos "ouvindo" a action de falha `ADD_PRODUCT_TO_CART_FAILURE` então precisamos adicionar:

```ts
case 'ADD_PRODUCT_TO_CART_FAILURE': {
  // TODO
  break;
}
```

### Trantando a falta de estoque

- Vamos tratar a falta de estoque dos itens que houveram tentativa de compra passando isso para um estado do reducer

- Primeiro precisamos adicionar essa nova prop na interface em `src/store/modules/cart/types`:

```ts
export interface CartState {
  items: CartItem[];
  failedStockCheck: number[];
}
```

- e em `src/store/modules/cart/reducer.ts` adicionamos o seguinte:

```ts
//...
case 'ADD_PRODUCT_TO_CART_FAILURE': {
        draft.failedStockCheck.push(product.id);
        break;
      }
//...
```

- Por fim realizamos ajustes no component `CatalogItem`:

```tsx
// ...
const hasFailedStockCheck = useSelector<State, boolean>((state) => {
    return state.cart.failedStockCheck.includes(product.id);
  });
// ...
{ hasFailedStockCheck && <span style={{ color: 'red' }}>Falta de estoque</span> }
// ...
```

---

### POG: como sobrescrever uma interface

- Podemos utilizar `extends Omit<InterfaceExtendida, 'attr1' | 'attr2'>` :

```ts
export interface ActionPayload {
  type: string;
  payload: {
    product: Product
  }
}
export interface ActionPayloadFailure extends Omit<ActionPayload, 'payload'> {
  payload: {
    product: Omit<Product, 'title' | 'price'>;
  }
}
```

---

### Ajustando os nomes das Actions para melhor manutenção

- Deixamos espalhado os nomes das actions, além de repetirmos em alguns outros lugares, isso para manutenção não será muito interessante, para resolver isso centralizamos um enum dentro do arquivo `types`:

```ts
export enum ActionTypes {
  addProductToCartReequest = 'ADD_PRODUCT_TO_CART_REQUEST',
  addProductToCartSuccess = 'ADD_PRODUCT_TO_CART_SUCCESS',
  addProductToCartFailure = 'ADD_PRODUCT_TO_CART_FAILURE',
}
```

- E ajustamos nos lugares onde essas actions são utilizadas como no caso do `reducer.ts`, `sagas.ts`
