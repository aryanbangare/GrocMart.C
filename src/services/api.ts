import type {
  AddToCartPayload,
  ApiResult,
  AuthUser,
  CartItem,
  CheckoutPayload,
  LoginPayload,
  Product,
  RegisterPayload,
  UpdateCartPayload,
} from "../types/types";

const BASE_URL = "http://localhost:5076/api/";

function toNumber(value: unknown): number | undefined {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function normalizeAuthUser(raw: unknown): AuthUser | null {
  if (typeof raw === "number") {
    return { userId: raw };
  }

  if (typeof raw === "string") {
    const parsed = toNumber(raw);
    return parsed !== undefined ? { userId: parsed } : { name: raw };
  }

  if (!raw || typeof raw !== "object") {
    return null;
  }

  const source = raw as Record<string, unknown>;
  const userId =
    toNumber(source.userId) ??
    toNumber(source.id) ??
    toNumber(source.userID) ??
    toNumber(source.UserId) ??
    toNumber(source.user_id);

  return {
    userId,
    id: toNumber(source.id),
    userID: toNumber(source.userID) ?? toNumber(source.UserID),
    name: typeof source.name === "string" ? source.name : undefined,
  };
}

function normalizeCartItems(raw: unknown): CartItem[] {
  if (!Array.isArray(raw)) {
    return [];
  }

  const items: CartItem[] = [];

  for (const entry of raw) {
    if (!entry || typeof entry !== "object") {
      continue;
    }

    const item = entry as Record<string, unknown>;
    const productId =
      toNumber(item.productId) ??
      toNumber(item.ProductId) ??
      toNumber(item.productID);
    const quantity =
      toNumber(item.quantity) ??
      toNumber(item.Quantity) ??
      toNumber(item.qty) ??
      0;

    if (productId === undefined) {
      continue;
    }

    items.push({
      cartId:
        toNumber(item.cartId) ??
        toNumber(item.CartId) ??
        toNumber(item.id) ??
        toNumber(item.cartID),
      productId,
      quantity,
      productName:
        typeof item.productName === "string"
          ? item.productName
          : typeof item.name === "string"
            ? item.name
            : undefined,
      price: toNumber(item.price) ?? toNumber(item.Price),
    });
  }

  return items;
}

function normalizeProducts(raw: unknown): Product[] {
  if (!Array.isArray(raw)) {
    return [];
  }

  const products: Product[] = [];

  for (const entry of raw) {
    if (!entry || typeof entry !== "object") {
      continue;
    }

    const item = entry as Record<string, unknown>;
    const productId =
      toNumber(item.productId) ??
      toNumber(item.ProductId) ??
      toNumber(item.productID) ??
      toNumber(item.id);

    if (productId === undefined) {
      continue;
    }

    products.push({
      productId,
      name:
        typeof item.name === "string"
          ? item.name
          : typeof item.productName === "string"
            ? item.productName
            : "Product",
      brand:
        typeof item.brand === "string"
          ? item.brand
          : typeof item.category === "string"
            ? item.category
            : "General",
      price: toNumber(item.price) ?? toNumber(item.Price) ?? 0,
      discountPrice:
        toNumber(item.discountPrice) ??
        toNumber(item.DiscountPrice) ??
        toNumber(item.price) ??
        toNumber(item.Price) ??
        0,
      availableQuantity:
        toNumber(item.availableQuantity) ??
        toNumber(item.AvailableQuantity) ??
        toNumber(item.stockQuantity) ??
        toNumber(item.StockQuantity) ??
        toNumber(item.stock) ??
        toNumber(item.Stock) ??
        toNumber(item.quantity) ??
        toNumber(item.Quantity) ??
        1,
    });
  }

  return products;
}

export async function get<TResult>(url: string) {
  return await request<TResult>("GET", url);
}

export async function post<TResult>(url: string, body: unknown) {
  return await request<TResult>("POST", url, body);
}

export async function put<TResult>(url: string, body: unknown) {
  return await request<TResult>("PUT", url, body);
}

export async function patch<TResult>(url: string, body: unknown) {
  return await request<TResult>("PATCH", url, body);
}

export async function del<TResult>(url: string) {
  return await request<TResult>("DELETE", url);
}

async function request<TResult>(method: string, url: string, body?: unknown) {
  const response = await fetch(BASE_URL + url, {
    method,
    body: body ? JSON.stringify(body) : undefined,
    headers: {
      Origin: window.location.host,
      "Content-Type": "application/json; charset=utf-8",
    },
  });

  if (response.headers.get("content-length") === "0") {
    return {} as TResult;
  }

  return (await response.json()) as TResult;
}

async function requestResult<T>(
  method: string,
  url: string,
  body?: unknown,
): Promise<ApiResult<T>> {
  try {
    const response = await fetch(BASE_URL + url, {
      method,
      body: body ? JSON.stringify(body) : undefined,
      headers: {
        Origin: window.location.host,
        "Content-Type": "application/json; charset=utf-8",
      },
    });

    const rawText = await response.text();
    let data: T | null = null;
    let message = response.ok ? "Success" : "Request failed";

    if (rawText) {
      try {
        data = JSON.parse(rawText) as T;
        if (
          typeof data === "object" &&
          data !== null &&
          "message" in data &&
          typeof (data as { message?: unknown }).message === "string"
        ) {
          message = (data as { message: string }).message;
        }
      } catch {
        message = rawText;
      }
    }

    return {
      ok: response.ok,
      status: response.status,
      data,
      message,
    };
  } catch {
    return {
      ok: false,
      status: 0,
      data: null,
      message: "Unable to connect to the server.",
    };
  }
}

async function tryRequestVariants<T>(
  variants: Array<{ method: string; url: string; body?: unknown }>,
): Promise<ApiResult<T>> {
  let lastResult: ApiResult<T> = {
    ok: false,
    status: 0,
    data: null,
    message: "Request failed",
  };

  for (const variant of variants) {
    const result = await requestResult<T>(
      variant.method,
      variant.url,
      variant.body,
    );

    if (result.ok) {
      return result;
    }

    lastResult = result;

    if (result.status !== 404 && result.status !== 405) {
      return result;
    }
  }

  return lastResult;
}

export async function login(data: LoginPayload) {
  const result = await requestResult<unknown>("POST", "Users/login", data);

  return {
    ...result,
    data: normalizeAuthUser(result.data),
  };
}

export async function register(data: RegisterPayload) {
  return await requestResult<AuthUser>("POST", "register", data);
}

export async function getProducts() {
  const products = await get<unknown>("products");
  return normalizeProducts(products);
}

export async function addToCart(data: AddToCartPayload) {
  return await tryRequestVariants<unknown>([
    
    {
      method: "POST",
      url: "cart",
      body: { userID: data.userId, productID: data.productId, quantity: data.quantity },
    },
    
    {
      method: "POST",
      url: "cart/add",
      body: { UserId: data.userId, ProductId: data.productId, Quantity: data.quantity },
    },
    {
      method: "POST",
      url: `cart/${data.userId}/${data.productId}`,
      body: { quantity: data.quantity },
    },
  ]);
}

export async function getCart(userId: number) {
  const items = await get<unknown>(`cart/${userId}`);
  return normalizeCartItems(items);
}

export async function updateCart(data: UpdateCartPayload) {
  return await tryRequestVariants<unknown>([
    
    
    {
      method: "POST",
      url: "cart",
      body: {
        UserId: data.userId,
        ProductId: data.productId,
        Quantity: data.quantity,
        CartId: data.cartId,
      },
    },
    
    {
      method: "POST",
      url: "cart/update",
      body: {
        userId: data.userId,
        productId: data.productId,
        quantity: data.quantity,
        cartId: data.cartId,
      },
    },
    
    
    {
      method: "POST",
      url: "cart/edit",
      body: {
        userId: data.userId,
        productId: data.productId,
        quantity: data.quantity,
        cartId: data.cartId,
      },
    },
  ]);
}

export async function removeFromCart(
  cartId?: number,
  productId?: number,
  userId?: number,
) {
  return await tryRequestVariants<unknown>([
    ...(cartId !== undefined
      ? [
          { method: "DELETE", url: `cart/${cartId}` },
          { method: "DELETE", url: `cart/remove/${cartId}` },
          { method: "POST", url: "cart/remove", body: { cartId } },
          { method: "POST", url: "cart/delete", body: { cartId } },
        ]
      : []),
    ...(productId !== undefined && userId !== undefined
      ? [
          {
            method: "POST",
            url: "cart/remove",
            body: { userId, productId },
          },
          {
            method: "DELETE",
            url: `cart/${userId}/${productId}`,
          },
        ]
      : []),
  ]);
}

export async function checkout(data: CheckoutPayload) {
  return await tryRequestVariants<unknown>([
    
    {
      method: "POST",
      url: "orders/checkout",
      body: {
        UserId: data.userId,
        TotalAmount: data.totalAmount,
        Items: data.items.map((item) => ({
          ProductId: item.productId,
          Quantity: item.quantity,
          Price: item.price,
        })),
      },
    },
  ]);
}
