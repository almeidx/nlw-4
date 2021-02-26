defmodule RocketpayWeb.AccountsControllerTest do
  use RocketpayWeb.ConnCase, async: true

  alias Rocketpay.{Account, User}

  describe "deposit/2" do
    setup %{conn: conn} do
      params = %{
        name: "Almeida",
        password: "123456",
        nickname: "Yeet",
        email: "almeidx@pm.me",
        age: 19
      }

      {:ok, %User{account: %Account{id: account_id}}} = Rocketpay.create_user(params)

      # banana:password123 -> base64
      conn = put_req_header(conn, "authorization", "Basic YmFuYW5hOnBhc3N3b3JkMTIz")

      {:ok, conn: conn, account_id: account_id}
    end

    test "when all parameters are valid, makes a deposit", %{conn: conn, account_id: account_id} do
      params = %{"value" => "50.00"}

      response =
        conn
        |> post(Routes.accounts_path(conn, :deposit, account_id, params))
        |> json_response(:ok)

      assert %{
               "account" => %{"balance" => "50.00", "id" => _id},
               "message" => "Balance changed successfully"
             } = response
    end

    test "when there's invalid parameters, returns an error", %{
      conn: conn,
      account_id: account_id
    } do
      params = %{"value" => "banana"}

      response =
        conn
        |> post(Routes.accounts_path(conn, :deposit, account_id, params))
        |> json_response(:bad_request)

      expected_response = %{"message" => "Invalid deposit value"}

      assert expected_response == response
    end
  end
end
