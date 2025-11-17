@{
    # Подавление ложных предупреждений о неиспользуемых переменных
    ExcludeRules = @(
        'PSUseDeclaredVarsMoreThanAssignments'
    )
    # Или можно использовать более точное правило:
    # Rules = @{
    #     PSUseDeclaredVarsMoreThanAssignments = @{
    #         Exclude = @('whoami')
    #     }
    # }
}

