defmodule RocketpayWeb.AccountsControllerTest do
  use RocketpayWeb.ConnCase, async: true

  alias Rocketpay.{Account, User}

  describe "deposit/2" do
    setup %{conn: conn} do
      first_params = %{
        name: "Test Subject",
        password: "123456",
        nickname: "Test Subject",
        email: "test@example.com",
        age: 19
      }

      second_params = %{
        name: "Test Subject 2",
        password: "123456",
        nickname: "Test Subject 2",
        email: "test2@example.com",
        age: 19
      }

      {:ok, %User{account: %Account{id: first_account_id}}} = Rocketpay.create_user(first_params)

      {:ok, %User{account: %Account{id: second_account_id}}} =
        Rocketpay.create_user(second_params)

      # banana:password123 -> base64
      conn = put_req_header(conn, "authorization", "Basic YmFuYW5hOnBhc3N3b3JkMTIz")

      {:ok, conn: conn, account_id: first_account_id, second_account_id: second_account_id}
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

    test "when there's invalid parameters, returns an error instead of depositing", %{
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

    test "when all parameters are valid, makes a withdraw", %{conn: conn, account_id: account_id} do
      params = %{"value" => "50.00"}

      response =
        conn
        |> post(Routes.accounts_path(conn, :deposit, account_id, params))
        |> post(Routes.accounts_path(conn, :withdraw, account_id, params))
        |> json_response(:ok)

      assert %{
               "account" => %{"balance" => "0.00", "id" => _id},
               "message" => "Balance changed successfully"
             } = response
    end

    test "when there's invalid parameters, returns an error instead of withdrawing", %{
      conn: conn,
      account_id: account_id
    } do
      params = %{"value" => "banana"}

      response =
        conn
        |> post(Routes.accounts_path(conn, :withdraw, account_id, params))
        |> json_response(:bad_request)

      expected_response = %{"message" => "Invalid deposit value"}

      assert expected_response == response
    end

    test "when all parameters are valid, makes a transaction", %{
      conn: conn,
      account_id: first_account_id,
      second_account_id: second_account_id
    } do
      params = %{"from" => first_account_id, "to" => second_account_id, "value" => "10.00"}

      response =
        conn
        |> post(Routes.accounts_path(conn, :deposit, first_account_id, %{"value" => "10.00"}))
        |> post(Routes.accounts_path(conn, :transaction, params))
        |> json_response(:ok)

      assert %{
               "message" => "Transaction completed successfully",
               "transaction" => %{
                 "from_account" => %{
                   "balance" => "0.00",
                   "id" => first_account_id
                 },
                 "to_account" => %{
                   "balance" => "10.00",
                   "id" => second_account_id
                 }
               }
             } == response
    end
  end
end
